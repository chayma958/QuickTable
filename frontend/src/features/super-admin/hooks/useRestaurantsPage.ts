import { createRestaurant, deleteRestaurant, getAllRestaurants, setRestaurantActive } from '@api/restaurants.api';
import { useToast } from '@store/toast-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { CreateRestaurantFormValues } from '../createRestaurant.schema';

function errorMessage(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
  );
}

export function useRestaurantsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const restaurantsQuery = useQuery({
    queryKey: ['all-restaurants'],
    queryFn: getAllRestaurants,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['all-restaurants'] });
  }

  const createMutation = useMutation({
    mutationFn: (values: CreateRestaurantFormValues) => createRestaurant(values),
    onSuccess: (_data, values) => {
      invalidate();
      toast.success(`Restaurant created — invitation sent to ${values.ownerEmail}`);
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not create this restaurant')),
  });
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => setRestaurantActive(id, isActive),
    onSuccess: invalidate,
    onError: (err) => toast.error(errorMessage(err, 'Could not update this restaurant')),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRestaurant(id),
    onSuccess: () => {
      invalidate();
      toast.success('Restaurant deleted');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not delete this restaurant')),
  });

  const restaurants = restaurantsQuery.data ?? [];

  async function handleSubmit(values: CreateRestaurantFormValues) {
    try {
      await createMutation.mutateAsync(values);
      setModalOpen(false);
    } catch {
    }
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id);
    setPendingDelete(null);
  }

  return {
    restaurants,
    activeCount: restaurants.filter((r) => r.isActive).length,
    modalOpen,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
    handleSubmit,
    toggleActive: (id: string, isActive: boolean) => toggleMutation.mutate({ id, isActive }),
    pendingDelete,
    requestDelete: (id: string, name: string) => setPendingDelete({ id, name }),
    cancelDelete: () => setPendingDelete(null),
    confirmDelete,
  };
}
