import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Role } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { StaffJwtPayload } from '../auth/types/jwt-payload.type';
import { SOCKET_EVENTS, orderRoom, restaurantRoom } from './events';

interface OrderBroadcastPayload {
  id: string;
  restaurantId: string;
  [key: string]: unknown;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('join:order')
  handleJoinOrder(client: Socket, payload: { orderId: string }) {
    if (!payload?.orderId) return;
    client.join(orderRoom(payload.orderId));
  }

  @SubscribeMessage('join:restaurant')
  handleJoinRestaurant(
    client: Socket,
    payload: { restaurantId: string; token: string },
  ) {
    const staff = this.verifyStaffToken(payload?.token);
    if (!staff) return client.emit('error', { message: 'Unauthorized' });
    if (
      staff.role !== Role.SUPER_ADMIN &&
      staff.restaurantId !== payload.restaurantId
    ) {
      return client.emit('error', { message: 'Forbidden' });
    }
    client.join(restaurantRoom(payload.restaurantId));
  }

  emitNewOrder(order: OrderBroadcastPayload) {
    this.server
      .to(restaurantRoom(order.restaurantId))
      .emit(SOCKET_EVENTS.ORDER_NEW, order);
  }

  emitOrderUpdated(order: OrderBroadcastPayload) {
    this.server
      .to(restaurantRoom(order.restaurantId))
      .emit(SOCKET_EVENTS.ORDER_UPDATED, order);
    this.server
      .to(orderRoom(order.id))
      .emit(SOCKET_EVENTS.ORDER_UPDATED, order);
  }

  emitTableRequestNew(request: {
    id: string;
    restaurantId: string;
    [key: string]: unknown;
  }) {
    this.server
      .to(restaurantRoom(request.restaurantId))
      .emit(SOCKET_EVENTS.TABLE_REQUEST_NEW, request);
  }

  emitTableRequestResolved(request: {
    id: string;
    restaurantId: string;
    [key: string]: unknown;
  }) {
    this.server
      .to(restaurantRoom(request.restaurantId))
      .emit(SOCKET_EVENTS.TABLE_REQUEST_RESOLVED, request);
  }

  emitTableUpdated(table: {
    id: string;
    restaurantId: string;
    [key: string]: unknown;
  }) {
    this.server
      .to(restaurantRoom(table.restaurantId))
      .emit(SOCKET_EVENTS.TABLE_UPDATED, table);
  }

  emitReviewNew(review: {
    id: string;
    restaurantId: string;
    [key: string]: unknown;
  }) {
    this.server
      .to(restaurantRoom(review.restaurantId))
      .emit(SOCKET_EVENTS.REVIEW_NEW, review);
  }

  emitKitchenNoteNew(note: {
    id: string;
    restaurantId: string;
    [key: string]: unknown;
  }) {
    this.server
      .to(restaurantRoom(note.restaurantId))
      .emit(SOCKET_EVENTS.KITCHEN_NOTE_NEW, note);
  }

  emitKitchenNoteAcknowledged(note: {
    id: string;
    restaurantId: string;
    [key: string]: unknown;
  }) {
    this.server
      .to(restaurantRoom(note.restaurantId))
      .emit(SOCKET_EVENTS.KITCHEN_NOTE_ACKNOWLEDGED, note);
  }

  private verifyStaffToken(token: string | undefined): StaffJwtPayload | null {
    if (!token) return null;
    try {
      const payload = this.jwt.verify<StaffJwtPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });
      return payload.type === 'staff' ? payload : null;
    } catch {
      return null;
    }
  }
}
