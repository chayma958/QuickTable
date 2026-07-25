import type { OrderStatus } from '@models/index';

const TABS: { label: string; value: OrderStatus | null }[] = [
  { label: 'All', value: null },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Preparing', value: 'PREPARING' },
  { label: 'Ready', value: 'READY' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export function OrderStatusTabs({
  active,
  onChange,
}: {
  active: OrderStatus | null;
  onChange: (status: OrderStatus | null) => void;
}) {
  return (
    <div className="mb-5 flex gap-2 overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab.label}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`shrink-0 rounded-full border px-4 py-2 text-[0.8125rem] font-semibold transition-colors ${
            active === tab.value
              ? 'border-text bg-text text-bg'
              : 'border-border bg-bg text-text-muted hover:text-text'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
