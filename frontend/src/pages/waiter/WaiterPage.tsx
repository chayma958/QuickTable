import { EmptyState } from '@components/ui/EmptyState';
import { Skeleton } from '@components/ui/Skeleton';
import { NotificationsFeed } from '@features/waiter/components/NotificationsFeed';
import { SplitBillModal } from '@features/waiter/components/SplitBillModal';
import { TableDetailModal } from '@features/waiter/components/TableDetailModal';
import { TableStatusCard } from '@features/waiter/components/TableStatusCard';
import { TransferTableModal } from '@features/waiter/components/TransferTableModal';
import { useWaiterDashboard } from '@features/waiter/hooks/useWaiterDashboard';
import { WaiterShell } from '@layouts/WaiterShell';
import { LayoutGrid } from 'lucide-react';

export function WaiterPage() {
  const {
    restaurant,
    isLoading,
    tables,
    allTables,
    viewMode,
    setViewMode,
    notifications,
    acknowledgeNote,
    selectedTable,
    openTable,
    closeTableDetail,
    resolveRequest,
    closeTable,
    closeTableError,
    markServed,
    markPaid,
    cancelOrder,
    removeItem,
    transferOrder,
    openTransfer,
    closeTransfer,
    confirmTransfer,
    splitOrder,
    openSplit,
    closeSplit,
  } = useWaiterDashboard();

  if (isLoading || !restaurant) {
    return (
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div>
          <Skeleton className="mb-5 h-7 w-24" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3.5">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="mb-5 h-7 w-32" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <WaiterShell title={restaurant.name}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h1 className="text-[1.375rem] font-bold text-text">Tables</h1>
            <div className="flex rounded-full border border-border bg-bg-subtle p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('my-tables')}
                className={`rounded-full px-3.5 py-1.5 transition-colors ${
                  viewMode === 'my-tables' ? 'bg-brand text-white' : 'text-text-muted hover:text-text'
                }`}
              >
                My Tables
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all-tables')}
                className={`rounded-full px-3.5 py-1.5 transition-colors ${
                  viewMode === 'all-tables' ? 'bg-brand text-white' : 'text-text-muted hover:text-text'
                }`}
              >
                All Tables
              </button>
            </div>
          </div>
          {tables.length === 0 ? (
            <EmptyState
              icon={LayoutGrid}
              title={viewMode === 'my-tables' ? 'No tables assigned to you' : 'No tables set up yet'}
              description={
                viewMode === 'my-tables'
                  ? 'Switch to All Tables to help out elsewhere, or ask the owner to assign you some.'
                  : 'Ask the owner to add tables from the dashboard.'
              }
            />
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3.5">
              {tables.map((table) => (
                <TableStatusCard key={table.id} table={table} onClick={() => openTable(table.id)} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-5 text-[1.375rem] font-bold text-text">
            Notifications{notifications.length > 0 && ` (${notifications.length})`}
          </h2>
          <NotificationsFeed notifications={notifications} onSelect={openTable} />
        </div>
      </div>

      {selectedTable && (
        <TableDetailModal
          table={selectedTable}
          restaurantName={restaurant.name}
          onClose={closeTableDetail}
          onMarkServed={markServed}
          onMarkPaid={markPaid}
          onResolveRequest={(requestId) => resolveRequest(selectedTable.id, requestId)}
          onCloseTable={() => closeTable(selectedTable.id)}
          closeTableError={closeTableError}
          onSplitBill={openSplit}
          onTransfer={openTransfer}
          onCancelOrder={cancelOrder}
          onRemoveItem={removeItem}
          onAcknowledgeNote={acknowledgeNote}
        />
      )}

      {transferOrder && (
        <TransferTableModal
          tables={allTables}
          currentTableId={transferOrder.tableId}
          onClose={closeTransfer}
          onConfirm={confirmTransfer}
        />
      )}

      {splitOrder && <SplitBillModal order={splitOrder} onClose={closeSplit} />}
    </WaiterShell>
  );
}
