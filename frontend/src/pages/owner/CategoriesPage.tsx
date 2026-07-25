import { EmptyState } from '@components/ui/EmptyState';
import { CategoryFormModal } from '@features/owner/categories/components/CategoryFormModal';
import { SortableCategoryRow } from '@features/owner/categories/components/SortableCategoryRow';
import { useCategoriesPage } from '@features/owner/categories/hooks/useCategoriesPage';
import { useOwnerContext } from '@layouts/OwnerShell';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Tags } from 'lucide-react';

export function CategoriesPage() {
  const { restaurant } = useOwnerContext();
  const { categories, modalState, openCreate, openEdit, closeModal, handleSubmit, deleteCategory, handleDragEnd } =
    useCategoriesPage(restaurant.id);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[1.375rem] font-bold text-text">Categories</h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-brand px-4.5 py-2.5 text-[0.8125rem] font-semibold text-white hover:bg-brand-dark"
        >
          + Add category
        </button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No categories yet"
          description="Group your menu items into categories like Pizza, Drinks, or Desserts."
          action={
            <button
              type="button"
              onClick={openCreate}
              className="rounded-lg bg-brand px-4.5 py-2.5 text-[0.8125rem] font-semibold text-white hover:bg-brand-dark"
            >
              + Add category
            </button>
          }
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {categories.map((category) => (
              <SortableCategoryRow
                key={category.id}
                category={category}
                onEdit={() => openEdit(category)}
                onDelete={() => deleteCategory(category.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {modalState.open && (
        <CategoryFormModal initial={modalState.category} onClose={closeModal} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
