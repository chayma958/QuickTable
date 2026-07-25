import { getRestaurantOrders } from '@api/orders.api';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const DAYS_TO_SHOW = 14;

export function useAnalyticsPage(restaurantId: string) {
  const ordersQuery = useQuery({
    queryKey: ['orders', restaurantId, null],
    queryFn: () => getRestaurantOrders(restaurantId),
  });

  const analytics = useMemo(() => {
    const orders = ordersQuery.data ?? [];
    const nonCancelled = orders.filter((o) => o.status !== 'CANCELLED');

    const revenueByDay = new Map<string, number>();
    const today = new Date();
    for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      revenueByDay.set(key, 0);
    }
    for (const order of nonCancelled) {
      const key = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (revenueByDay.has(key)) {
        revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + Number(order.totalAmount));
      }
    }
    const revenueSeries = [...revenueByDay.entries()].map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue * 100) / 100,
    }));

    const dishCounts = new Map<string, number>();
    for (const order of nonCancelled) {
      for (const item of order.items) {
        dishCounts.set(item.nameSnapshot, (dishCounts.get(item.nameSnapshot) ?? 0) + item.quantity);
      }
    }
    const topDishes = [...dishCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, quantity]) => ({ name, quantity }))
      .reverse();

    const completed = orders.filter((o) => o.status === 'DELIVERED').length;
    const completionRate = orders.length ? (completed / orders.length) * 100 : 0;

    const prepDurations = orders
      .filter((o) => o.confirmedAt && o.readyAt)
      .map((o) => (new Date(o.readyAt!).getTime() - new Date(o.confirmedAt!).getTime()) / 60_000);
    const avgPrepMinutes = prepDurations.length
      ? prepDurations.reduce((a, b) => a + b, 0) / prepDurations.length
      : 0;

    const customerCounts = new Map<string, number>();
    for (const order of orders) {
      if (!order.customerId) continue;
      customerCounts.set(order.customerId, (customerCounts.get(order.customerId) ?? 0) + 1);
    }
    const repeatCustomers = [...customerCounts.values()].filter((count) => count > 1).length;
    const repeatRate = customerCounts.size ? (repeatCustomers / customerCounts.size) * 100 : 0;

    const revenueByWaiterMap = new Map<string, number>();
    for (const order of orders) {
      if (order.status !== 'DELIVERED') continue;
      const name = order.servedBy?.name ?? 'Unassigned';
      revenueByWaiterMap.set(name, (revenueByWaiterMap.get(name) ?? 0) + Number(order.totalAmount));
    }
    const revenueByWaiter = [...revenueByWaiterMap.entries()]
      .map(([name, revenue]) => ({ name, revenue: Math.round(revenue * 100) / 100 }))
      .sort((a, b) => b.revenue - a.revenue);

    return { revenueSeries, topDishes, completionRate, avgPrepMinutes, repeatRate, revenueByWaiter };
  }, [ordersQuery.data]);

  return { analytics, daysToShow: DAYS_TO_SHOW };
}
