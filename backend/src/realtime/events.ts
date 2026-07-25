export const SOCKET_EVENTS = {
  ORDER_NEW: 'order:new',
  ORDER_UPDATED: 'order:updated',
  TABLE_REQUEST_NEW: 'table-request:new',
  TABLE_REQUEST_RESOLVED: 'table-request:resolved',
  TABLE_UPDATED: 'table:updated',
  REVIEW_NEW: 'review:new',
  KITCHEN_NOTE_NEW: 'kitchen-note:new',
  KITCHEN_NOTE_ACKNOWLEDGED: 'kitchen-note:acknowledged',
} as const;

export function restaurantRoom(restaurantId: string): string {
  return `restaurant:${restaurantId}`;
}

export function orderRoom(orderId: string): string {
  return `order:${orderId}`;
}
