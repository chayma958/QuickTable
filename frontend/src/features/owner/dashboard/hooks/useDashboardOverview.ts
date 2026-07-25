import { getRestaurantOrders } from '@api/orders.api';
import { getReviews, getReviewSummary } from '@api/reviews.api';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function useDashboardOverview(restaurantId: string) {
  const ordersQuery = useQuery({
    queryKey: ['orders', restaurantId, null],
    queryFn: () => getRestaurantOrders(restaurantId),
  });
  const reviewSummaryQuery = useQuery({
    queryKey: ['review-summary', restaurantId],
    queryFn: () => getReviewSummary(restaurantId),
  });
  const reviewsQuery = useQuery({
    queryKey: ['reviews', restaurantId],
    queryFn: () => getReviews(restaurantId),
  });

  const stats = useMemo(() => {
    const orders = ordersQuery.data ?? [];
    const nonCancelled = orders.filter((o) => o.status !== 'CANCELLED');
    const todayOrders = orders.filter((o) => isToday(o.createdAt));
    const todayNonCancelled = todayOrders.filter((o) => o.status !== 'CANCELLED');
    const todaySales = todayNonCancelled.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
    const avgOrderValue = nonCancelled.length
      ? nonCancelled.reduce((sum, o) => sum + Number(o.totalAmount), 0) / nonCancelled.length
      : 0;

    const dishCounts = new Map<string, number>();
    for (const order of nonCancelled) {
      for (const item of order.items) {
        dishCounts.set(item.nameSnapshot, (dishCounts.get(item.nameSnapshot) ?? 0) + item.quantity);
      }
    }
    const topDishes = [...dishCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);

    return { todaySales, todayOrdersCount: todayOrders.length, pendingCount, avgOrderValue, topDishes, recentOrders };
  }, [ordersQuery.data]);

  return { stats, reviewSummary: reviewSummaryQuery.data, reviews: reviewsQuery.data ?? [] };
}
