import { getAvailableActions, STATUS_LABELS } from '@lib/order-actions';
import { STATUS_BADGE_CLASS } from '@lib/order-status-style';
import type { Order } from '@models/index';
import { Phone } from 'lucide-react';

export function OrderCard({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (status: Order['status']) => void;
}) {
  const actions = getAvailableActions(order);
  const originLabel = `Table ${order.table?.number ?? '?'}`;

  return (
    <div className="rounded-xl border border-border bg-bg p-4">
      <div className="mb-2.5 flex items-start justify-between">
        <div>
          <div className="text-base font-bold text-text">Order #{order.orderNumber}</div>
          <div className="mt-0.5 text-xs text-text-muted">
            {originLabel} · {order.customerName ?? 'Guest'} ·{' '}
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          {order.customerPhone && (
            <div className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
              <Phone size={11} />
              <a href={`tel:${order.customerPhone}`} className="hover:text-brand hover:underline">
                {order.customerPhone}
              </a>
            </div>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-bold uppercase ${STATUS_BADGE_CLASS[order.status]}`}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="mb-2.5 text-[0.8125rem] text-text">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between py-0.5">
            <span>
              {item.quantity}x {item.nameSnapshot}
            </span>
            <span>${Number(item.subtotal).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-dashed border-border pt-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-[0.9375rem] font-bold text-text">${Number(order.totalAmount).toFixed(2)}</span>
          {order.servedBy && (
            <span className="text-[0.6875rem] text-text-muted">Served by {order.servedBy.name}</span>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {actions.map((action) => (
            <button
              key={action.nextStatus}
              type="button"
              onClick={() => onStatusChange(action.nextStatus)}
              className={
                action.isDestructive
                  ? 'rounded-lg border border-danger px-3.5 py-1.5 text-[0.8125rem] font-semibold text-danger hover:bg-danger/10'
                  : 'rounded-lg border border-brand bg-brand px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white hover:bg-brand-dark'
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
