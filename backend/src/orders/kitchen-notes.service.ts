import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { KitchenNoteReason, KitchenNoteStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import type { AuthenticatedStaff } from '../auth/types/jwt-payload.type';
import { CreateKitchenNoteDto } from './dto/create-kitchen-note.dto';

@Injectable()
export class KitchenNotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async create(
    restaurantId: string,
    orderId: string,
    dto: CreateKitchenNoteDto,
    requester: AuthenticatedStaff,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order || order.restaurantId !== restaurantId) {
      throw new NotFoundException('Order not found');
    }
    if (dto.reason === KitchenNoteReason.CUSTOM && !dto.message?.trim()) {
      throw new BadRequestException('A message is required for a custom note');
    }

    const note = await this.prisma.kitchenNote.create({
      data: {
        restaurantId,
        orderId,
        tableId: order.tableId,
        reason: dto.reason,
        message: dto.message?.trim() || undefined,
        createdById: requester.id,
      },
    });
    this.realtime.emitKitchenNoteNew(note);
    return note;
  }

  async acknowledge(restaurantId: string, orderId: string, noteId: string) {
    const note = await this.prisma.kitchenNote.findUnique({
      where: { id: noteId },
    });
    if (
      !note ||
      note.restaurantId !== restaurantId ||
      note.orderId !== orderId
    ) {
      throw new NotFoundException('Note not found');
    }
    const updated = await this.prisma.kitchenNote.update({
      where: { id: noteId },
      data: {
        status: KitchenNoteStatus.ACKNOWLEDGED,
        acknowledgedAt: new Date(),
      },
    });
    this.realtime.emitKitchenNoteAcknowledged(updated);
    return updated;
  }
}
