import type { OrderStatus } from '@models/index';

export const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  PENDING: 'bg-[var(--color-status-pending-bg)] text-[var(--color-status-pending)]',
  CONFIRMED: 'bg-[var(--color-status-progress-bg)] text-[var(--color-status-progress)]',
  PREPARING: 'bg-[var(--color-status-progress-bg)] text-[var(--color-status-progress)]',
  READY: 'bg-[var(--color-status-ready-bg)] text-[var(--color-status-ready)]',
  DELIVERED: 'bg-[var(--color-status-done-bg)] text-[var(--color-status-done)]',
  CANCELLED: 'bg-[var(--color-status-cancelled-bg)] text-[var(--color-status-cancelled)]',
};
