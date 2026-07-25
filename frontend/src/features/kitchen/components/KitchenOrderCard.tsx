import type { Order } from '@models/index';
import { MessageCircleWarning } from 'lucide-react';
import { useEffect, useState } from 'react';

const URGENT_MINUTES = 15;

function useElapsedMinutes(since: string): number {
  const [minutes, setMinutes] = useState(() => (Date.now() - new Date(since).getTime()) / 60_000);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes((Date.now() - new Date(since).getTime()) / 60_000);
    }, 15_000);
    return () => clearInterval(interval);
  }, [since]);

  return minutes;
}

export function KitchenOrderCard({
  order,
  actionLabel,
  onAction,
  onNotifyWaiter,
}: {
  order: Order;
  actionLabel: string | null;
  onAction: () => void;
  onNotifyWaiter: () => void;
}) {
  const elapsed = useElapsedMinutes(order.createdAt);
  const origin = order.type === 'DINE_IN' ? `Table ${order.table?.number ?? '?'}` : order.type;

  return (
    <div className="mb-4 rounded-xl border border-slate-700 bg-slate-800 p-5">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <span className="text-[1.375rem] font-extrabold text-white">#{order.orderNumber}</span>
        <span className="text-[0.8125rem] text-slate-400">{origin}</span>
        <span className={`text-[0.9375rem] font-bold ${elapsed >= URGENT_MINUTES ? 'text-red-400' : 'text-amber-400'}`}>
          {Math.floor(elapsed)} min
        </span>
        <button
          type="button"
          onClick={onNotifyWaiter}
          aria-label="Notify waiter"
          title="Notify waiter"
          className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-amber-300"
        >
          <MessageCircleWarning size={17} />
        </button>
      </div>
      <div className="mb-4">
        {order.items.map((item) => (
          <div key={item.id}>
            <div className="flex gap-2 py-0.5 text-[1.0625rem] text-slate-200">
              <span className="min-w-8 font-extrabold text-emerald-300">{item.quantity}x</span>
              <span>{item.nameSnapshot}</span>
            </div>
            {item.notes && <div className="ml-10 text-[0.8125rem] italic text-slate-400">"{item.notes}"</div>}
          </div>
        ))}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="w-full rounded-lg bg-brand py-4.5 text-[1.0625rem] font-extrabold uppercase tracking-wide text-white active:scale-[0.98] active:bg-brand-dark"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
