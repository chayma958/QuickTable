import { queryClient } from '@lib/query-client';
import { getSocket } from '@lib/socket';
import type { Order, OrderStatus } from '@models/index';
import { useToast } from '@store/toast-context';
import { useEffect, useRef } from 'react';

const STATUS_MESSAGE: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: 'Your order has been accepted by the restaurant.',
  PREPARING: 'The kitchen has started preparing your order.',
  READY: 'Your order is ready!',
  DELIVERED: 'Order complete — enjoy your meal!',
  CANCELLED: 'Your order was cancelled.',
};

export function useOrderTrackingRealtime(orderId: string | undefined) {
  const toast = useToast();
  const lastStatus = useRef<OrderStatus | null>(null);

  useEffect(() => {
    lastStatus.current = null;
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    const socket = getSocket();

    const handleUpdate = (order: Order) => {
      if (order.id !== orderId) return;
      const previousStatus =
        lastStatus.current ?? queryClient.getQueryData<Order>(['order-tracking', orderId])?.status ?? null;
      queryClient.setQueryData(['order-tracking', orderId], order);
      if (previousStatus && previousStatus !== order.status) {
        const message = STATUS_MESSAGE[order.status];
        if (message) toast.info(message);
      }
      lastStatus.current = order.status;
    };

    socket.emit('join:order', { orderId });
    socket.on('order:updated', handleUpdate);

    return () => {
      socket.off('order:updated', handleUpdate);
    };
  }, [orderId, toast]);
}
