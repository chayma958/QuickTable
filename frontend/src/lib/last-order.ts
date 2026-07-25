const ORDER_HISTORY_KEY = 'quicktable:orderHistory';
const MAX_HISTORY = 20;

export function addOrderToHistory(orderId: string) {
  const existing = getOrderHistory().filter((id) => id !== orderId);
  const updated = [orderId, ...existing].slice(0, MAX_HISTORY);
  localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(updated));
}

export function getOrderHistory(): string[] {
  try {
    const raw = localStorage.getItem(ORDER_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLastOrderId(): string | null {
  return getOrderHistory()[0] ?? null;
}
