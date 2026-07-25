import { getRestaurantOrders, updateOrderStatus } from '@api/orders.api';
import type { OrderStatus } from '@models/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export function useOrdersPage(restaurantId: string) {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);

  const ordersQuery = useQuery({
    queryKey: ['orders', restaurantId, statusFilter],
    queryFn: () => getRestaurantOrders(restaurantId, statusFilter ?? undefined),
    refetchInterval: 20_000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => updateOrderStatus(restaurantId, id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders', restaurantId] }),
  });

  return {
    orders: ordersQuery.data ?? [],
    statusFilter,
    setStatusFilter,
    onStatusChange: (id: string, status: OrderStatus) => statusMutation.mutate({ id, status }),
  };
}
