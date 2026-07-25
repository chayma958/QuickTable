import type { AuditLogEntry } from '@api/orders.api';

const ACTION_LABELS: Record<string, string> = {
  CREATED: 'Created',
  STATUS_CHANGED: 'Status changed',
  TABLE_TRANSFERRED: 'Table transferred',
};

function describe(entry: AuditLogEntry): string {
  const meta = entry.metadata ?? {};
  switch (entry.action) {
    case 'CREATED':
      return `Order #${entry.order?.orderNumber} was placed`;
    case 'STATUS_CHANGED':
      return `Order #${entry.order?.orderNumber} moved from ${meta.from} to ${meta.to}`;
    case 'TABLE_TRANSFERRED':
      return `Order #${entry.order?.orderNumber} was transferred to another table`;
    default:
      return `${entry.action} on order #${entry.order?.orderNumber}`;
  }
}

export function AuditLogRow({ entry }: { entry: AuditLogEntry }) {
  return (
    <div className="mb-2.5 flex gap-3.5 rounded-xl border border-border bg-bg p-3.5">
      <span className="h-fit shrink-0 whitespace-nowrap rounded-full bg-bg-subtle px-2.5 py-1 text-[0.6875rem] font-bold uppercase text-text-muted">
        {ACTION_LABELS[entry.action] ?? entry.action}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-text">{describe(entry)}</div>
        <div className="mt-0.5 text-xs text-text-muted">
          {entry.user ? `${entry.user.name} (${entry.user.role.replace('_', ' ').toLowerCase()})` : 'Customer'} ·{' '}
          {new Date(entry.createdAt).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
