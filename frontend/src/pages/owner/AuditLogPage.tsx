import { getAuditLogs } from '@api/orders.api';
import { EmptyState } from '@components/ui/EmptyState';
import { AuditLogRow } from '@features/owner/audit-log/components/AuditLogRow';
import { useOwnerContext } from '@layouts/OwnerShell';
import { useQuery } from '@tanstack/react-query';
import { History } from 'lucide-react';

export function AuditLogPage() {
  const { restaurant } = useOwnerContext();

  const logsQuery = useQuery({
    queryKey: ['audit-logs', restaurant.id],
    queryFn: () => getAuditLogs(restaurant.id),
    refetchInterval: 30_000,
  });

  const logs = logsQuery.data ?? [];

  return (
    <div>
      <h1 className="mb-5 text-[1.375rem] font-bold text-text">Activity log</h1>

      {logs.length === 0 ? (
        <EmptyState icon={History} title="No activity recorded yet" description="Order and table events will appear here as they happen." />
      ) : (
        logs.map((entry) => <AuditLogRow key={entry.id} entry={entry} />)
      )}
    </div>
  );
}
