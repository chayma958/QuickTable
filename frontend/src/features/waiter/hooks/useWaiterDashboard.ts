import {
  acknowledgeKitchenNote,
  markOrderPaid,
  removeOrderItem,
  transferTable,
  updateOrderStatus,
} from '@api/orders.api';
import { closeTable, getTablesOverview, resolveTableRequest } from '@api/tables.api';
import { useMyRestaurant } from '@hooks/useMyRestaurant';
import { useRestaurantRealtime } from '@hooks/useRestaurantRealtime';
import type { KitchenNoteReason, Order, TableOverview } from '@models/index';
import { useAuth } from '@store/auth-context';
import { useToast } from '@store/toast-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

function errorMessage(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
  );
}

export interface WaiterNotification {
  id: string;
  tableId: string;
  tableNumber: number;
  kind: 'ASSISTANCE' | 'BILL' | 'ORDER_READY' | 'KITCHEN_NOTE';
  createdAt: string;
  orderNumber?: number;
  orderId?: string;
  reason?: KitchenNoteReason;
  message?: string | null;
}

export function useWaiterDashboard() {
  const { data: restaurant, isLoading: isRestaurantLoading } = useMyRestaurant();
  const { actor } = useAuth();
  const currentWaiterId = actor?.type === 'staff' ? actor.id : undefined;
  const queryClient = useQueryClient();
  const toast = useToast();
  useRestaurantRealtime(restaurant?.id);

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [transferOrder, setTransferOrder] = useState<Order | null>(null);
  const [splitOrder, setSplitOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<'my-tables' | 'all-tables'>('my-tables');

  const overviewQuery = useQuery({
    queryKey: ['tables-overview', restaurant?.id],
    queryFn: () => getTablesOverview(restaurant!.id),
    enabled: !!restaurant,
    refetchInterval: 20_000,
  });

  const tables = overviewQuery.data ?? [];

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['tables-overview', restaurant?.id] });
  }

  const resolveMutation = useMutation({
    mutationFn: ({ tableId, requestId }: { tableId: string; requestId: string }) =>
      resolveTableRequest(restaurant!.id, tableId, requestId),
    onSuccess: () => {
      invalidate();
      toast.success('Request resolved');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not resolve this request')),
  });

  const closeTableMutation = useMutation({
    mutationFn: (tableId: string) => closeTable(restaurant!.id, tableId),
    onSuccess: () => {
      invalidate();
      toast.success('Table closed');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not close this table')),
  });

  const markServedMutation = useMutation({
    mutationFn: (orderId: string) => updateOrderStatus(restaurant!.id, orderId, 'DELIVERED'),
    onSuccess: () => {
      invalidate();
      toast.success('Marked as served');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not update this order')),
  });

  const markPaidMutation = useMutation({
    mutationFn: (orderId: string) => markOrderPaid(restaurant!.id, orderId),
    onSuccess: () => {
      invalidate();
      toast.success('Payment recorded');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not record payment')),
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => updateOrderStatus(restaurant!.id, orderId, 'CANCELLED'),
    onSuccess: () => {
      invalidate();
      toast.success('Order cancelled');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not cancel this order')),
  });

  const removeItemMutation = useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: string; itemId: string }) =>
      removeOrderItem(restaurant!.id, orderId, itemId),
    onSuccess: () => {
      invalidate();
      toast.success('Item removed');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not remove this item')),
  });

  const transferMutation = useMutation({
    mutationFn: ({ orderId, tableId }: { orderId: string; tableId: string }) =>
      transferTable(restaurant!.id, orderId, tableId),
    onSuccess: () => {
      invalidate();
      setTransferOrder(null);
      toast.success('Table transferred');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not transfer this table')),
  });

  const acknowledgeNoteMutation = useMutation({
    mutationFn: ({ orderId, noteId }: { orderId: string; noteId: string }) =>
      acknowledgeKitchenNote(restaurant!.id, orderId, noteId),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(errorMessage(err, 'Could not acknowledge this note')),
  });

  const notifications = useMemo<WaiterNotification[]>(() => {
    const items: WaiterNotification[] = [];
    for (const table of tables) {
      if (table.assignedWaiterId && table.assignedWaiterId !== currentWaiterId) continue;
      for (const request of table.requests) {
        items.push({
          id: request.id,
          tableId: table.id,
          tableNumber: table.number,
          kind: request.type,
          createdAt: request.createdAt,
        });
      }
      for (const note of table.kitchenNotes) {
        items.push({
          id: note.id,
          tableId: table.id,
          tableNumber: table.number,
          kind: 'KITCHEN_NOTE',
          createdAt: note.createdAt,
          orderId: note.orderId,
          reason: note.reason,
          message: note.message,
        });
      }
      const readyOrder = table.activeOrders.find((o) => o.status === 'READY');
      if (readyOrder) {
        items.push({
          id: readyOrder.id,
          tableId: table.id,
          tableNumber: table.number,
          kind: 'ORDER_READY',
          createdAt: readyOrder.readyAt ?? readyOrder.createdAt,
          orderNumber: readyOrder.orderNumber,
        });
      }
    }
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tables, currentWaiterId]);

  const selectedTable: TableOverview | undefined = tables.find((t) => t.id === selectedTableId);

  const visibleTables = useMemo(() => {
    if (viewMode === 'all-tables') return tables;
    return tables.filter((t) => !t.assignedWaiterId || t.assignedWaiterId === currentWaiterId);
  }, [tables, viewMode, currentWaiterId]);

  return {
    restaurant,
    isLoading: isRestaurantLoading || !restaurant,
    tables: visibleTables,
    allTables: tables,
    viewMode,
    setViewMode,
    notifications,
    acknowledgeNote: (orderId: string, noteId: string) =>
      acknowledgeNoteMutation.mutate({ orderId, noteId }),
    selectedTable,
    openTable: (tableId: string) => setSelectedTableId(tableId),
    closeTableDetail: () => setSelectedTableId(null),
    resolveRequest: (tableId: string, requestId: string) => resolveMutation.mutate({ tableId, requestId }),
    closeTable: (tableId: string) => closeTableMutation.mutate(tableId),
    closeTableError: closeTableMutation.isError
      ? ((closeTableMutation.error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Could not close this table')
      : null,
    markServed: (orderId: string) => markServedMutation.mutate(orderId),
    markPaid: (orderId: string) => markPaidMutation.mutate(orderId),
    cancelOrder: (orderId: string) => cancelOrderMutation.mutate(orderId),
    removeItem: (orderId: string, itemId: string) => removeItemMutation.mutate({ orderId, itemId }),
    transferOrder,
    openTransfer: (order: Order) => setTransferOrder(order),
    closeTransfer: () => setTransferOrder(null),
    confirmTransfer: async (tableId: string) => {
      if (!transferOrder) return;
      await transferMutation.mutateAsync({ orderId: transferOrder.id, tableId });
    },
    splitOrder,
    openSplit: (order: Order) => setSplitOrder(order),
    closeSplit: () => setSplitOrder(null),
  };
}
