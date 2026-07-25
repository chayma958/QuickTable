import { getSocket } from '@lib/socket';
import { getSession } from '@lib/session';
import { queryClient } from '@lib/query-client';
import { useEffect } from 'react';

export function useRestaurantRealtime(restaurantId: string | undefined) {
  useEffect(() => {
    if (!restaurantId) return;
    const socket = getSocket();
    const session = getSession();
    if (!session) return;

    const invalidateOrders = () => {
      queryClient.invalidateQueries({ queryKey: ['orders', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['tables-overview', restaurantId] });
    };
    const invalidateTables = () => {
      queryClient.invalidateQueries({ queryKey: ['tables-overview', restaurantId] });
    };
    const invalidateReviews = () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['review-summary', restaurantId] });
    };

    socket.emit('join:restaurant', { restaurantId, token: session.accessToken });
    socket.on('order:new', invalidateOrders);
    socket.on('order:updated', invalidateOrders);
    socket.on('table-request:new', invalidateTables);
    socket.on('table-request:resolved', invalidateTables);
    socket.on('table:updated', invalidateTables);
    socket.on('review:new', invalidateReviews);
    socket.on('kitchen-note:new', invalidateTables);
    socket.on('kitchen-note:acknowledged', invalidateTables);

    return () => {
      socket.off('order:new', invalidateOrders);
      socket.off('order:updated', invalidateOrders);
      socket.off('table-request:new', invalidateTables);
      socket.off('table-request:resolved', invalidateTables);
      socket.off('table:updated', invalidateTables);
      socket.off('review:new', invalidateReviews);
      socket.off('kitchen-note:new', invalidateTables);
      socket.off('kitchen-note:acknowledged', invalidateTables);
    };
  }, [restaurantId]);
}
