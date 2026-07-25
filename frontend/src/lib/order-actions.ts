import type { Order, OrderStatus } from '@models/index';

export interface OrderAction {
  label: string;
  nextStatus: OrderStatus;
  isDestructive?: boolean;
}

export function getAvailableActions(order: Order): OrderAction[] {
  switch (order.status) {
    case 'PENDING':
      return [
        { label: 'Accept', nextStatus: 'CONFIRMED' },
        { label: 'Cancel', nextStatus: 'CANCELLED', isDestructive: true },
      ];
    case 'CONFIRMED':
      return [
        { label: 'Start preparing', nextStatus: 'PREPARING' },
        { label: 'Cancel', nextStatus: 'CANCELLED', isDestructive: true },
      ];
    case 'PREPARING':
      return [
        { label: 'Mark ready', nextStatus: 'READY' },
        { label: 'Cancel', nextStatus: 'CANCELLED', isDestructive: true },
      ];
    case 'READY':
      return [{ label: 'Mark delivered', nextStatus: 'DELIVERED' }];
    default:
      return [];
  }
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY: 'Ready',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};
