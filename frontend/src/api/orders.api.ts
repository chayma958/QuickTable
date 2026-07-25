import { apiClient } from '@lib/api-client';
import type { KitchenNote, KitchenNoteReason, Order, OrderStatus, PaymentMethod } from '@models/index';

export interface CreateOrderInput {
  restaurantId: string;
  tableId: string;
  items: { menuItemId: string; quantity: number; notes?: string }[];
  couponCode?: string;
  paymentMethod: PaymentMethod;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}

export async function createOrder(input: CreateOrderInput) {
  const { data } = await apiClient.post<Order>('/orders', input);
  return data;
}

export async function trackOrder(id: string) {
  const { data } = await apiClient.get<Order>(`/orders/track/${id}`);
  return data;
}

export async function getRestaurantOrders(restaurantId: string, status?: OrderStatus) {
  const { data } = await apiClient.get<Order[]>(`/restaurants/${restaurantId}/orders`, {
    params: status ? { status } : undefined,
  });
  return data;
}

export async function getOrder(restaurantId: string, id: string) {
  const { data } = await apiClient.get<Order>(`/restaurants/${restaurantId}/orders/${id}`);
  return data;
}

export async function updateOrderStatus(restaurantId: string, id: string, status: OrderStatus) {
  const { data } = await apiClient.patch<Order>(
    `/restaurants/${restaurantId}/orders/${id}/status`,
    { status },
  );
  return data;
}

export async function removeOrderItem(restaurantId: string, orderId: string, itemId: string) {
  const { data } = await apiClient.delete<Order>(
    `/restaurants/${restaurantId}/orders/${orderId}/items/${itemId}`,
  );
  return data;
}

export async function markOrderPaid(restaurantId: string, id: string) {
  const { data } = await apiClient.patch<Order>(`/restaurants/${restaurantId}/orders/${id}/mark-paid`, {});
  return data;
}

export async function transferTable(restaurantId: string, id: string, tableId: string) {
  const { data } = await apiClient.patch<Order>(
    `/restaurants/${restaurantId}/orders/${id}/transfer-table`,
    { tableId },
  );
  return data;
}

export async function createKitchenNote(
  restaurantId: string,
  orderId: string,
  reason: KitchenNoteReason,
  message?: string,
) {
  const { data } = await apiClient.post<KitchenNote>(
    `/restaurants/${restaurantId}/orders/${orderId}/notes`,
    { reason, message },
  );
  return data;
}

export async function acknowledgeKitchenNote(restaurantId: string, orderId: string, noteId: string) {
  const { data } = await apiClient.patch<KitchenNote>(
    `/restaurants/${restaurantId}/orders/${orderId}/notes/${noteId}/acknowledge`,
    {},
  );
  return data;
}

export interface AuditLogEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: { id: string; name: string; role: string } | null;
  order: { id: string; orderNumber: number } | null;
}

export async function getAuditLogs(restaurantId: string, orderId?: string) {
  const { data } = await apiClient.get<AuditLogEntry[]>(
    `/restaurants/${restaurantId}/orders/audit-logs`,
    { params: orderId ? { orderId } : undefined },
  );
  return data;
}
