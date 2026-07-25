import { ConfirmDialog } from '@components/ui/ConfirmDialog';
import { EmptyState } from '@components/ui/EmptyState';
import { CreateRestaurantModal } from '@features/super-admin/components/CreateRestaurantModal';
import { RestaurantRow } from '@features/super-admin/components/RestaurantRow';
import { useRestaurantsPage } from '@features/super-admin/hooks/useRestaurantsPage';
import { AdminShell } from '@layouts/AdminShell';
import { Store } from 'lucide-react';

export function RestaurantsPage() {
  const {
    restaurants,
    activeCount,
    modalOpen,
    openModal,
    closeModal,
    handleSubmit,
    toggleActive,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useRestaurantsPage();

  return (
    <AdminShell>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[1.375rem] font-bold text-text">Restaurants</h1>
        <button
          type="button"
          onClick={openModal}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          + Add restaurant
        </button>
      </div>

      <div className="mb-6 grid max-w-[500px] grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
        <div className="rounded-xl border border-border bg-bg p-4">
          <div className="text-[0.8125rem] font-semibold text-text-muted">Total restaurants</div>
          <div className="mt-1 text-2xl font-bold text-text">{restaurants.length}</div>
        </div>
        <div className="rounded-xl border border-border bg-bg p-4">
          <div className="text-[0.8125rem] font-semibold text-text-muted">Active</div>
          <div className="mt-1 text-2xl font-bold text-text">{activeCount}</div>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No restaurants yet"
          description="Onboard the first tenant to start managing restaurants on the platform."
          action={
            <button
              type="button"
              onClick={openModal}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
            >
              + Add restaurant
            </button>
          }
        />
      ) : (
        restaurants.map((restaurant) => (
          <RestaurantRow
            key={restaurant.id}
            restaurant={restaurant}
            onToggleActive={(isActive) => toggleActive(restaurant.id, isActive)}
            onDelete={() => requestDelete(restaurant.id, restaurant.name)}
          />
        ))
      )}

      {modalOpen && <CreateRestaurantModal onClose={closeModal} onSubmit={handleSubmit} />}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete restaurant"
          message={`Permanently delete "${pendingDelete.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          isDestructive
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </AdminShell>
  );
}
