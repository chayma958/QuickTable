import {
  createMenuItem,
  deleteMenuItem,
  getCategories,
  getMenuItems,
  setMenuItemAvailability,
  updateMenuItem,
} from '@api/menu.api';
import type { MenuItem } from '@models/index';
import { useToast } from '@store/toast-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { MenuItemFormValues } from '../menuItem.schema';

export function useMenuManagementPage(restaurantId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [modalState, setModalState] = useState<{ open: boolean; item?: MenuItem }>({ open: false });

  const itemsQuery = useQuery({
    queryKey: ['menu-items', restaurantId],
    queryFn: () => getMenuItems(restaurantId),
  });
  const categoriesQuery = useQuery({
    queryKey: ['categories', restaurantId],
    queryFn: () => getCategories(restaurantId),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['menu-items', restaurantId] });
  }

  const createMutation = useMutation({
    mutationFn: (values: MenuItemFormValues) => createMenuItem(restaurantId, values),
    onSuccess: () => {
      invalidate();
      toast.success('Menu item created');
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: MenuItemFormValues }) =>
      updateMenuItem(restaurantId, id, values),
    onSuccess: () => {
      invalidate();
      toast.success('Menu item updated');
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMenuItem(restaurantId, id),
    onSuccess: () => {
      invalidate();
      toast.success('Menu item deleted');
    },
  });
  const availabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      setMenuItemAvailability(restaurantId, id, isAvailable),
    onSuccess: invalidate,
  });

  async function handleSubmit(values: MenuItemFormValues) {
    if (modalState.item) {
      await updateMutation.mutateAsync({ id: modalState.item.id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setModalState({ open: false });
  }

  return {
    items: itemsQuery.data ?? [],
    categories: categoriesQuery.data ?? [],
    modalState,
    openCreate: () => setModalState({ open: true }),
    openEdit: (item: MenuItem) => setModalState({ open: true, item }),
    closeModal: () => setModalState({ open: false }),
    handleSubmit,
    deleteItem: (id: string) => deleteMutation.mutate(id),
    setAvailability: (id: string, isAvailable: boolean) => availabilityMutation.mutate({ id, isAvailable }),
  };
}
