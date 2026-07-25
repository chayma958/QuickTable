import type { TableOverview } from '@models/index';

const STATUS_CONFIG: Record<TableOverview['status'], { label: string; dot: string; ring: string }> = {
  FREE: { label: 'Free', dot: 'bg-border', ring: 'border-border' },
  EATING: { label: 'Eating', dot: 'bg-green-500', ring: 'border-green-200' },
  READY: { label: 'Food ready', dot: 'bg-amber-500', ring: 'border-amber-200' },
  NEEDS_ASSISTANCE: { label: 'Needs assistance', dot: 'bg-red-500', ring: 'border-red-200' },
};

export function TableStatusCard({ table, onClick }: { table: TableOverview; onClick: () => void }) {
  const config = STATUS_CONFIG[table.status];
  const total = table.activeOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-2.5 rounded-2xl border bg-bg p-4 text-left transition-shadow hover:shadow-elevated ${
        table.status === 'NEEDS_ASSISTANCE' ? config.ring : 'border-border'
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-base font-bold text-text">Table {table.number}</span>
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${config.dot}`} />
      </div>
      <span className="text-[0.8125rem] font-semibold text-text-muted">{config.label}</span>
      {table.isOccupied && total > 0 && (
        <span className="text-xs text-text-muted">${total.toFixed(2)} open</span>
      )}
      {table.assignedWaiter && (
        <span className="rounded-full bg-brand-light px-2 py-0.5 text-[0.6875rem] font-semibold text-brand-dark">
          {table.assignedWaiter.name}
        </span>
      )}
    </button>
  );
}
