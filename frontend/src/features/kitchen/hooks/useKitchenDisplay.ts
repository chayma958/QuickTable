import { createKitchenNote, getRestaurantOrders, updateOrderStatus } from '@api/orders.api';
import { useMyRestaurant } from '@hooks/useMyRestaurant';
import { useRestaurantRealtime } from '@hooks/useRestaurantRealtime';
import type { KitchenNoteReason, Order } from '@models/index';
import { useToast } from '@store/toast-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export function useKitchenDisplay() {
  const { data: restaurant, isLoading: isRestaurantLoading } = useMyRestaurant();
  const queryClient = useQueryClient();
  const toast = useToast();
  useRestaurantRealtime(restaurant?.id);

  const [notifyOrder, setNotifyOrder] = useState<Order | null>(null);

  const ordersQuery = useQuery({
    queryKey: ['orders', restaurant?.id, null],
    queryFn: () => getRestaurantOrders(restaurant!.id),
    enabled: !!restaurant,
    refetchInterval: 15_000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      updateOrderStatus(restaurant!.id, id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders', restaurant?.id] }),
  });

  const notifyMutation = useMutation({
    mutationFn: ({
      orderId,
      reason,
      message,
    }: {
      orderId: string;
      reason: KitchenNoteReason;
      message?: string;
    }) => createKitchenNote(restaurant!.id, orderId, reason, message),
    onSuccess: () => {
      toast.success('Waiter notified');
      setNotifyOrder(null);
    },
    onError: () => toast.error('Could not send this note'),
  });

  const orders = ordersQuery.data ?? [];

  return {
    restaurant,
    isLoading: isRestaurantLoading || !restaurant,
    incoming: orders.filter((o) => o.status === 'PENDING'),
    preparing: orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PREPARING'),
    ready: orders.filter((o) => o.status === 'READY'),
    setStatus: (id: string, status: Order['status']) => statusMutation.mutate({ id, status }),
    notifyOrder,
    openNotify: (order: Order) => setNotifyOrder(order),
    closeNotify: () => setNotifyOrder(null),
    isSendingNote: notifyMutation.isPending,
    sendNote: (reason: KitchenNoteReason, message?: string) => {
      if (!notifyOrder) return;
      notifyMutation.mutate({ orderId: notifyOrder.id, reason, message });
    },
  };
}
