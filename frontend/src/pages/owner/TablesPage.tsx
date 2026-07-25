import { EmptyState } from '@components/ui/EmptyState';
import { TableCard } from '@features/owner/tables/components/TableCard';
import { useTablesPage } from '@features/owner/tables/hooks/useTablesPage';
import { useOwnerContext } from '@layouts/OwnerShell';
import { LayoutGrid } from 'lucide-react';

export function TablesPage() {
  const { restaurant } = useOwnerContext();
  const { tables, waiters, newNumber, setNewNumber, handleAddSubmit, toggleActive, deleteTable, assignWaiter } =
    useTablesPage(restaurant.id);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[1.375rem] font-bold text-text">Tables</h1>
        <form onSubmit={handleAddSubmit} className="flex gap-2">
          <input
            type="number"
            min={1}
            placeholder="#"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            className="w-20 rounded-lg border border-border px-2.5 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand px-4 py-2 text-[0.8125rem] font-semibold text-white hover:bg-brand-dark"
          >
            + Add table
          </button>
        </form>
      </div>

      {tables.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="No tables yet"
          description="Add a table number above to generate its printable QR code."
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              waiters={waiters}
              onToggleActive={(isActive) => toggleActive(table.id, isActive)}
              onDelete={() => deleteTable(table.id)}
              onAssignWaiter={(waiterId) => assignWaiter(table.id, waiterId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
