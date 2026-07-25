import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Coupon,
  CouponType,
  OrderStatus,
  PaymentStatus,
  Prisma,
  Restaurant,
  Table,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import type { AuthenticatedStaff } from '../auth/types/jwt-payload.type';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { TransferTableDto } from './dto/transfer-table.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import {
  ORDER_STATUS_TIMESTAMP_FIELD,
  assertValidTransition,
} from './order-status.util';

const ORDER_INCLUDE = {
  items: { where: { removedAt: null } },
  table: true,
  coupon: true,
  restaurant: { select: { name: true, slug: true } },
  customer: { select: { id: true, name: true, phone: true, email: true } },
  servedBy: { select: { id: true, name: true } },
} satisfies Prisma.OrderInclude;

interface OrderPricing {
  restaurant: Restaurant;
  table: Table;
  orderItemsData: Array<{
    menuItemId: string;
    nameSnapshot: string;
    priceSnapshot: Prisma.Decimal;
    quantity: number;
    subtotal: Prisma.Decimal;
    notes: string | undefined;
  }>;
  subtotal: Prisma.Decimal;
  taxAmount: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  totalAmount: Prisma.Decimal;
  coupon: Coupon | null;
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async create(dto: CreateOrderDto) {
    const resolvedCustomerId = dto.customerPhone
      ? await this.upsertGuestCustomer(dto.customerPhone, dto.customerName)
      : null;

    const pricing = await this.computePricing(dto, resolvedCustomerId);
    const {
      restaurant,
      table,
      orderItemsData,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      coupon,
    } = pricing;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          restaurantId: restaurant.id,
          tableId: table.id,
          customerId: resolvedCustomerId,
          type: 'DINE_IN',
          subtotal,
          taxAmount,
          discountAmount,
          totalAmount,
          couponId: coupon?.id,
          paymentMethod: dto.paymentMethod,
          paymentStatus: 'PENDING',
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          notes: dto.notes,
          items: { create: orderItemsData },
        },
        include: ORDER_INCLUDE,
      });

      if (!table.isOccupied) {
        await tx.table.update({
          where: { id: table.id },
          data: {
            isOccupied: true,
            currentSessionStartedAt: created.createdAt,
          },
        });
      }

      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } },
        });
      }

      await tx.auditLog.create({
        data: {
          entityType: 'Order',
          entityId: created.id,
          action: 'CREATED',
          orderId: created.id,
        },
      });

      return created;
    });

    this.realtime.emitNewOrder(order);
    return order;
  }

  private async upsertGuestCustomer(phone: string, name?: string) {
    const existing = await this.prisma.customer.findUnique({
      where: { phone },
    });
    try {
      const customer = existing
        ? await this.prisma.customer.update({
            where: { id: existing.id },
            data: { name: name ?? undefined },
          })
        : await this.prisma.customer.create({ data: { phone, name } });
      return customer.id;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        const customer = await this.prisma.customer.findUniqueOrThrow({
          where: { phone },
        });
        return customer.id;
      }
      throw err;
    }
  }

  private async computePricing(
    dto: CreateOrderDto,
    customerId: string | null,
  ): Promise<OrderPricing> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dto.restaurantId },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found');
    }

    const table = await this.prisma.table.findUnique({
      where: { id: dto.tableId },
    });
    if (!table || table.restaurantId !== restaurant.id || !table.isActive) {
      throw new BadRequestException('Invalid table for this restaurant');
    }

    const menuItemIds = [...new Set(dto.items.map((i) => i.menuItemId))];
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, restaurantId: restaurant.id },
    });
    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException(
        'One or more menu items are invalid for this restaurant',
      );
    }
    const unavailable = menuItems.filter((item) => !item.isAvailable);
    if (unavailable.length > 0) {
      throw new BadRequestException(
        `Currently unavailable: ${unavailable.map((i) => i.name).join(', ')}`,
      );
    }

    const itemsById = new Map(menuItems.map((item) => [item.id, item]));
    const orderItemsData = dto.items.map((line: CreateOrderItemDto) => {
      const menuItem = itemsById.get(line.menuItemId)!;
      const unitPrice = menuItem.discountPrice ?? menuItem.price;
      return {
        menuItemId: menuItem.id,
        nameSnapshot: menuItem.name,
        priceSnapshot: unitPrice,
        quantity: line.quantity,
        subtotal: unitPrice.mul(line.quantity),
        notes: line.notes,
      };
    });

    const subtotal = orderItemsData.reduce(
      (sum, item) => sum.add(item.subtotal),
      new Prisma.Decimal(0),
    );

    const taxAmount = subtotal.mul(restaurant.taxRate).div(100);

    let discountAmount = new Prisma.Decimal(0);
    let coupon: Coupon | null = null;
    if (dto.couponCode) {
      coupon = await this.validateCoupon(
        restaurant.id,
        dto.couponCode,
        subtotal,
        customerId,
      );
      if (coupon.type === CouponType.PERCENTAGE) {
        discountAmount = subtotal.mul(coupon.value).div(100);
      } else if (coupon.type === CouponType.FIXED) {
        discountAmount = Prisma.Decimal.min(coupon.value, subtotal);
      }
    }

    const totalAmount = Prisma.Decimal.max(
      0,
      subtotal.add(taxAmount).sub(discountAmount),
    );

    return {
      restaurant,
      table,
      orderItemsData,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      coupon,
    };
  }

  async findAllForRestaurant(restaurantId: string, status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: { restaurantId, ...(status ? { status } : {}) },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForStaff(restaurantId: string, id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });
    if (!order || order.restaurantId !== restaurantId) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findAuditLogs(restaurantId: string, orderId?: string) {
    return this.prisma.auditLog.findMany({
      where: {
        order: { restaurantId },
        ...(orderId ? { orderId } : {}),
      },
      include: {
        user: { select: { id: true, name: true, role: true } },
        order: { select: { id: true, orderNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async findPublicTracking(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        type: true,
        subtotal: true,
        taxAmount: true,
        discountAmount: true,
        totalAmount: true,
        paymentMethod: true,
        paymentStatus: true,
        createdAt: true,
        confirmedAt: true,
        preparingAt: true,
        readyAt: true,
        deliveredAt: true,
        cancelledAt: true,
        items: { where: { removedAt: null } },
        tableId: true,
        table: { select: { number: true, isOccupied: true } },
        restaurant: {
          select: { name: true, slug: true, logoUrl: true, phone: true },
        },
        review: { select: { rating: true, comment: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(
    restaurantId: string,
    id: string,
    dto: UpdateOrderStatusDto,
    requester: AuthenticatedStaff,
  ) {
    const order = await this.findOneForStaff(restaurantId, id);
    assertValidTransition(order.status, dto.status, requester.role);

    const timestampField = ORDER_STATUS_TIMESTAMP_FIELD[dto.status];
    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.order.update({
        where: { id },
        data: {
          status: dto.status,
          ...(timestampField ? { [timestampField]: new Date() } : {}),
          ...(dto.status === OrderStatus.DELIVERED
            ? { servedByUserId: requester.id }
            : {}),
        },
        include: ORDER_INCLUDE,
      });
      await tx.auditLog.create({
        data: {
          entityType: 'Order',
          entityId: id,
          action: 'STATUS_CHANGED',
          userId: requester.id,
          orderId: id,
          metadata: { from: order.status, to: dto.status },
        },
      });

      return result;
    });

    this.realtime.emitOrderUpdated(updated);
    return updated;
  }

  async removeItem(
    restaurantId: string,
    orderId: string,
    itemId: string,
    requester: AuthenticatedStaff,
  ) {
    const order = await this.findOneForStaff(restaurantId, orderId);
    if (order.status !== OrderStatus.PENDING) {
      throw new ConflictException(
        'Items can only be removed while the order is still pending',
      );
    }

    const item = order.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Order item not found');
    if (order.items.length === 1) {
      throw new BadRequestException(
        'Cancel the order instead of removing its only item',
      );
    }

    const restaurant = await this.prisma.restaurant.findUniqueOrThrow({
      where: { id: restaurantId },
    });

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.orderItem.update({
        where: { id: itemId },
        data: { removedAt: new Date(), removedByUserId: requester.id },
      });

      const remainingSubtotal = order.items
        .filter((i) => i.id !== itemId)
        .reduce((sum, i) => sum.add(i.subtotal), new Prisma.Decimal(0));
      const taxAmount = remainingSubtotal.mul(restaurant.taxRate).div(100);
      const discountAmount = Prisma.Decimal.min(
        order.discountAmount,
        remainingSubtotal.add(taxAmount),
      );
      const totalAmount = Prisma.Decimal.max(
        0,
        remainingSubtotal.add(taxAmount).sub(discountAmount),
      );

      const result = await tx.order.update({
        where: { id: orderId },
        data: {
          subtotal: remainingSubtotal,
          taxAmount,
          discountAmount,
          totalAmount,
        },
        include: ORDER_INCLUDE,
      });

      await tx.auditLog.create({
        data: {
          entityType: 'Order',
          entityId: orderId,
          action: 'ITEM_REMOVED',
          userId: requester.id,
          orderId,
          metadata: { itemId, name: item.nameSnapshot },
        },
      });

      return result;
    });

    this.realtime.emitOrderUpdated(updated);
    return updated;
  }

  async markPaid(restaurantId: string, id: string) {
    const order = await this.findOneForStaff(restaurantId, id);
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('This order is already marked paid');
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { paymentStatus: PaymentStatus.PAID },
      include: ORDER_INCLUDE,
    });

    this.realtime.emitOrderUpdated(updated);
    return updated;
  }

  async transferTable(
    restaurantId: string,
    id: string,
    dto: TransferTableDto,
    requester: AuthenticatedStaff,
  ) {
    const order = await this.findOneForStaff(restaurantId, id);
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new ForbiddenException('This order is already finalized');
    }
    if (order.tableId === dto.tableId) {
      throw new BadRequestException('Order is already on that table');
    }

    const targetTable = await this.prisma.table.findUnique({
      where: { id: dto.tableId },
    });
    if (
      !targetTable ||
      targetTable.restaurantId !== restaurantId ||
      !targetTable.isActive
    ) {
      throw new BadRequestException('Invalid table for this restaurant');
    }

    const previousTableId = order.tableId;
    const previousTable = previousTableId
      ? await this.prisma.table.findUnique({ where: { id: previousTableId } })
      : null;
    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.order.update({
        where: { id },
        data: { tableId: targetTable.id },
        include: ORDER_INCLUDE,
      });
      await tx.auditLog.create({
        data: {
          entityType: 'Order',
          entityId: id,
          action: 'TABLE_TRANSFERRED',
          userId: requester.id,
          orderId: id,
          metadata: { fromTableId: previousTableId, toTableId: targetTable.id },
        },
      });

      const targetSessionStart =
        targetTable.isOccupied && targetTable.currentSessionStartedAt
          ? new Date(
              Math.min(
                targetTable.currentSessionStartedAt.getTime(),
                order.createdAt.getTime(),
              ),
            )
          : order.createdAt;
      await tx.table.update({
        where: { id: targetTable.id },
        data: { isOccupied: true, currentSessionStartedAt: targetSessionStart },
      });

      if (previousTable) {
        const remaining = await tx.order.count({
          where: {
            tableId: previousTable.id,
            status: { not: OrderStatus.CANCELLED },
            createdAt: {
              gte:
                previousTable.currentSessionStartedAt ??
                previousTable.createdAt,
            },
          },
        });
        if (remaining === 0) {
          await tx.table.update({
            where: { id: previousTable.id },
            data: { isOccupied: false, currentSessionStartedAt: null },
          });
        }
      }

      return result;
    });

    this.realtime.emitOrderUpdated(updated);
    return updated;
  }

  private async validateCoupon(
    restaurantId: string,
    code: string,
    subtotal: Prisma.Decimal,
    customerId: string | null,
  ) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { restaurantId_code: { restaurantId, code } },
    });
    if (!coupon || !coupon.isActive)
      throw new BadRequestException('Invalid coupon code');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('This coupon has expired');
    }
    if (coupon.minOrderAmount && subtotal.lt(coupon.minOrderAmount)) {
      throw new BadRequestException(
        `This coupon requires a minimum order of ${coupon.minOrderAmount.toString()}`,
      );
    }
    if (
      coupon.maxUsageCount !== null &&
      coupon.usageCount >= coupon.maxUsageCount
    ) {
      throw new BadRequestException('This coupon has reached its usage limit');
    }
    if (coupon.maxUsagePerCustomer !== null && customerId) {
      const usedByCustomer = await this.prisma.order.count({
        where: {
          couponId: coupon.id,
          customerId,
          status: { not: OrderStatus.CANCELLED },
        },
      });
      if (usedByCustomer >= coupon.maxUsagePerCustomer) {
        throw new BadRequestException(
          'You have already used this coupon the maximum number of times',
        );
      }
    }
    return coupon;
  }
}
