import type { Employee, RestaurantTable } from '@models/index';

export function TableCard({
  table,
  waiters,
  onToggleActive,
  onDelete,
  onAssignWaiter,
}: {
  table: RestaurantTable;
  waiters: Employee[];
  onToggleActive: (isActive: boolean) => void;
  onDelete: () => void;
  onAssignWaiter: (waiterId: string | null) => void;
}) {
  function handleDownload() {
    if (!table.qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = table.qrCodeUrl;
    link.download = `table-${table.number}-qr.png`;
    link.click();
  }

  return (
    <div className={`rounded-xl border border-border bg-bg p-4 text-center ${!table.isActive ? 'opacity-50' : ''}`}>
      <div className="mb-2.5 text-base font-bold text-text">Table {table.number}</div>
      {table.qrCodeUrl && (
        <img
          src={table.qrCodeUrl}
          alt={`QR for table ${table.number}`}
          className="mb-2.5 aspect-square w-full rounded-lg bg-white object-contain"
        />
      )}
      <div className="mb-2.5">
        <select
          value={table.assignedWaiterId ?? ''}
          onChange={(e) => onAssignWaiter(e.target.value || null)}
          className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text focus:outline-none focus:ring-2 focus:ring-brand-light"
        >
          <option value="">Unassigned</option>
          {waiters.map((waiter) => (
            <option key={waiter.id} value={waiter.id}>
              {waiter.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg-subtle"
        >
          Download
        </button>
        <button
          type="button"
          onClick={() => onToggleActive(!table.isActive)}
          className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg-subtle"
        >
          {table.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-danger px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/10"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
