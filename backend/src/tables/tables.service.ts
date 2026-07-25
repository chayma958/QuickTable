import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  KitchenNoteStatus,
  OrderStatus,
  PaymentStatus,
  Role,
  TableRequestStatus,
} from '@prisma/client';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import {
  AssignWaiterDto,
  CreateTableDto,
  CreateTableRequestDto,
} from './dto/table.dto';

export type TableStatus = 'FREE' | 'EATING' | 'READY' | 'NEEDS_ASSISTANCE';

@Injectable()
export class TablesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async create(restaurantId: string, dto: CreateTableDto) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const existing = await this.prisma.table.findUnique({
      where: { restaurantId_number: { restaurantId, number: dto.number } },
    });
    if (existing)
      throw new ConflictException(`Table ${dto.number} already exists`);

    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:5173';
    const orderingUrl = `${frontendUrl}/r/${restaurant.slug}/table/${dto.number}`;
    const qrCodeUrl = await QRCode.toDataURL(orderingUrl, {
      width: 400,
      margin: 1,
    });

    return this.prisma.table.create({
      data: { restaurantId, number: dto.number, qrCodeUrl },
    });
  }

  findAll(restaurantId: string) {
    return this.prisma.table.findMany({
      where: { restaurantId },
      include: { assignedWaiter: { select: { id: true, name: true } } },
      orderBy: { number: 'asc' },
    });
  }

  async assignWaiter(
    restaurantId: string,
    tableId: string,
    dto: AssignWaiterDto,
  ) {
    const table = await this.assertBelongsToRestaurant(restaurantId, tableId);

    if (dto.waiterId) {
      const waiter = await this.prisma.user.findUnique({
        where: { id: dto.waiterId },
      });
      if (
        !waiter ||
        waiter.restaurantId !== restaurantId ||
        waiter.role !== Role.WAITER
      ) {
        throw new BadRequestException(
          'That waiter is not part of this restaurant',
        );
      }
    }

    const updated = await this.prisma.table.update({
      where: { id: table.id },
      data: { assignedWaiterId: dto.waiterId },
      include: { assignedWaiter: { select: { id: true, name: true } } },
    });
    this.realtime.emitTableUpdated(updated);
    return updated;
  }

  async findPublicByNumber(slug: string, number: number) {
    const table = await this.prisma.table.findFirst({
      where: { number, isActive: true, restaurant: { slug, isActive: true } },
      select: { id: true, number: true },
    });
    if (!table) throw new NotFoundException('Table not found');
    return table;
  }

  async setActive(restaurantId: string, id: string, isActive: boolean) {
    const table = await this.assertBelongsToRestaurant(restaurantId, id);
    return this.prisma.table.update({
      where: { id: table.id },
      data: { isActive },
    });
  }

  async remove(restaurantId: string, id: string) {
    const table = await this.assertBelongsToRestaurant(restaurantId, id);
    await this.prisma.table.delete({ where: { id: table.id } });
  }

  async createRequest(tableId: string, dto: CreateTableRequestDto) {
    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
    });
    if (!table || !table.isActive)
      throw new NotFoundException('Table not found');

    const existing = await this.prisma.tableRequest.findFirst({
      where: { tableId, type: dto.type, status: TableRequestStatus.PENDING },
    });
    if (existing) return existing;

    const request = await this.prisma.tableRequest.create({
      data: { restaurantId: table.restaurantId, tableId, type: dto.type },
    });
    this.realtime.emitTableRequestNew(request);
    return request;
  }

  async resolveRequest(
    restaurantId: string,
    tableId: string,
    requestId: string,
  ) {
    const request = await this.prisma.tableRequest.findUnique({
      where: { id: requestId },
    });
    if (
      !request ||
      request.restaurantId !== restaurantId ||
      request.tableId !== tableId
    ) {
      throw new NotFoundException('Request not found');
    }
    const updated = await this.prisma.tableRequest.update({
      where: { id: requestId },
      data: { status: TableRequestStatus.RESOLVED, resolvedAt: new Date() },
    });
    this.realtime.emitTableRequestResolved(updated);
    return updated;
  }

  async closeTable(restaurantId: string, tableId: string) {
    const table = await this.assertBelongsToRestaurant(restaurantId, tableId);
    if (!table.isOccupied) {
      throw new BadRequestException('This table is already free');
    }

    const unpaidOrders = await this.prisma.order.count({
      where: {
        tableId,
        status: { not: OrderStatus.CANCELLED },
        paymentStatus: { not: PaymentStatus.PAID },
        createdAt: { gte: table.currentSessionStartedAt ?? table.createdAt },
      },
    });
    if (unpaidOrders > 0) {
      throw new BadRequestException(
        'This table still has an unpaid order — collect payment before closing it',
      );
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.table.update({
        where: { id: tableId },
        data: { isOccupied: false, currentSessionStartedAt: null },
      }),
      this.prisma.tableRequest.updateMany({
        where: { tableId, status: TableRequestStatus.PENDING },
        data: { status: TableRequestStatus.RESOLVED, resolvedAt: new Date() },
      }),
    ]);

    this.realtime.emitTableUpdated(updated);
    return updated;
  }

  async getOverview(restaurantId: string) {
    const [tables, pendingRequests, openNotes] = await Promise.all([
      this.prisma.table.findMany({
        where: { restaurantId },
        include: { assignedWaiter: { select: { id: true, name: true } } },
        orderBy: { number: 'asc' },
      }),
      this.prisma.tableRequest.findMany({
        where: { restaurantId, status: TableRequestStatus.PENDING },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.kitchenNote.findMany({
        where: { restaurantId, status: KitchenNoteStatus.OPEN },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const requestsByTable = new Map<string, typeof pendingRequests>();
    for (const request of pendingRequests) {
      const list = requestsByTable.get(request.tableId) ?? [];
      list.push(request);
      requestsByTable.set(request.tableId, list);
    }

    const notesByTable = new Map<string, typeof openNotes>();
    for (const note of openNotes) {
      if (!note.tableId) continue;
      const list = notesByTable.get(note.tableId) ?? [];
      list.push(note);
      notesByTable.set(note.tableId, list);
    }

    return Promise.all(
      tables.map(async (table) => {
        const requests = requestsByTable.get(table.id) ?? [];
        const kitchenNotes = notesByTable.get(table.id) ?? [];
        const activeOrders = table.isOccupied
          ? await this.prisma.order.findMany({
              where: {
                tableId: table.id,
                status: { not: OrderStatus.CANCELLED },
                createdAt: {
                  gte: table.currentSessionStartedAt ?? table.createdAt,
                },
              },
              include: {
                items: { where: { removedAt: null } },
                table: { select: { number: true } },
              },
              orderBy: { createdAt: 'desc' },
            })
          : [];

        let status: TableStatus = 'FREE';
        if (table.isOccupied) {
          const hasReady = activeOrders.some(
            (o) => o.status === OrderStatus.READY,
          );
          status =
            requests.length > 0 || kitchenNotes.length > 0
              ? 'NEEDS_ASSISTANCE'
              : hasReady
                ? 'READY'
                : 'EATING';
        }

        return { ...table, status, requests, kitchenNotes, activeOrders };
      }),
    );
  }

  private async assertBelongsToRestaurant(
    restaurantId: string,
    tableId: string,
  ) {
    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
    });
    if (!table || table.restaurantId !== restaurantId) {
      throw new NotFoundException('Table not found');
    }
    return table;
  }
}
