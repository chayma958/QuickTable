import { EmptyState } from '@components/ui/EmptyState';
import { MenuItemFormModal } from '@features/owner/menu-management/components/MenuItemFormModal';
import { MenuItemRow } from '@features/owner/menu-management/components/MenuItemRow';
import { useMenuManagementPage } from '@features/owner/menu-management/hooks/useMenuManagementPage';
import { useOwnerContext } from '@layouts/OwnerShell';
import { UtensilsCrossed } from 'lucide-react';

export function MenuManagementPage() {
  const { restaurant } = useOwnerContext();
  const { items, categories, modalState, openCreate, openEdit, closeModal, handleSubmit, deleteItem, setAvailability } =
    useMenuManagementPage(restaurant.id);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[1.375rem] font-bold text-text">Menu</h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-brand px-4.5 py-2.5 text-[0.8125rem] font-semibold text-white hover:bg-brand-dark"
        >
          + Add item
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No menu items yet"
          description="Add your first dish to start building a menu customers can order from."
          action={
            <button
              type="button"
              onClick={openCreate}
              className="rounded-lg bg-brand px-4.5 py-2.5 text-[0.8125rem] font-semibold text-white hover:bg-brand-dark"
            >
              + Add item
            </button>
          }
        />
      ) : (
        items.map((item) => (
          <MenuItemRow
            key={item.id}
            item={item}
            onEdit={() => openEdit(item)}
            onDelete={() => deleteItem(item.id)}
            onToggleAvailability={(isAvailable) => setAvailability(item.id, isAvailable)}
          />
        ))
      )}

      {modalState.open && (
        <MenuItemFormModal
          categories={categories}
          initial={modalState.item}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
