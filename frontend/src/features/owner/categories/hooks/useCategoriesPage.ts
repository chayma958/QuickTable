import { createCategory, deleteCategory, getCategories, reorderCategories, updateCategory } from '@api/menu.api';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Category } from '@models/index';
import { useToast } from '@store/toast-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { CategoryFormValues } from '../category.schema';

export function useCategoriesPage(restaurantId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [modalState, setModalState] = useState<{ open: boolean; category?: Category }>({ open: false });

  const categoriesQuery = useQuery({
    queryKey: ['categories', restaurantId],
    queryFn: () => getCategories(restaurantId),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['categories', restaurantId] });
  }

  const createMutation = useMutation({
    mutationFn: (values: CategoryFormValues) => createCategory(restaurantId, values),
    onSuccess: () => {
      invalidate();
      toast.success('Category created');
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CategoryFormValues }) =>
      updateCategory(restaurantId, id, values),
    onSuccess: () => {
      invalidate();
      toast.success('Category updated');
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(restaurantId, id),
    onSuccess: () => {
      invalidate();
      toast.success('Category deleted');
    },
  });
  const reorderMutation = useMutation({
    mutationFn: (items: { id: string; sortOrder: number }[]) => reorderCategories(restaurantId, items),
    onSuccess: invalidate,
  });

  const categories = categoriesQuery.data ?? [];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(categories, oldIndex, newIndex);
    reorderMutation.mutate(reordered.map((c, index) => ({ id: c.id, sortOrder: index })));
  }

  async function handleSubmit(values: CategoryFormValues) {
    if (modalState.category) {
      await updateMutation.mutateAsync({ id: modalState.category.id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setModalState({ open: false });
  }

  return {
    categories,
    modalState,
    openCreate: () => setModalState({ open: true }),
    openEdit: (category: Category) => setModalState({ open: true, category }),
    closeModal: () => setModalState({ open: false }),
    handleSubmit,
    deleteCategory: (id: string) => deleteMutation.mutate(id),
    handleDragEnd,
  };
}
