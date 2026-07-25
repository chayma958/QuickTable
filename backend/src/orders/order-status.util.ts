import { ForbiddenException } from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';

const ALLOWED_NEXT: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  CONFIRMED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  PREPARING: [OrderStatus.READY, OrderStatus.CANCELLED],
  READY: [OrderStatus.DELIVERED],
  DELIVERED: [],
  CANCELLED: [],
};

const ROLES_FOR_TRANSITION: Record<string, Role[]> = {
  'PENDING->CONFIRMED': [Role.KITCHEN],
  'PENDING->CANCELLED': [Role.WAITER],
  'CONFIRMED->PREPARING': [Role.KITCHEN],
  'PREPARING->READY': [Role.KITCHEN],
  'READY->DELIVERED': [Role.WAITER],
};

export const ORDER_STATUS_TIMESTAMP_FIELD: Partial<
  Record<OrderStatus, string>
> = {
  CONFIRMED: 'confirmedAt',
  PREPARING: 'preparingAt',
  READY: 'readyAt',
  DELIVERED: 'deliveredAt',
  CANCELLED: 'cancelledAt',
};

export function assertValidTransition(
  from: OrderStatus,
  to: OrderStatus,
  role: Role,
): void {
  if (role === Role.OWNER) return;

  if (!ALLOWED_NEXT[from]?.includes(to)) {
    throw new ForbiddenException(`Cannot move an order from ${from} to ${to}`);
  }

  const allowedRoles = ROLES_FOR_TRANSITION[`${from}->${to}`] ?? [];
  if (!allowedRoles.includes(role)) {
    throw new ForbiddenException(
      `Your role cannot move an order from ${from} to ${to}`,
    );
  }
}
