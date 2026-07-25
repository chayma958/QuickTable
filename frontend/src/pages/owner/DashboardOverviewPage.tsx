import { ListEmpty, ListPanel, ListRow } from '@features/owner/dashboard/components/ListPanel';
import { StatTile } from '@features/owner/dashboard/components/StatTile';
import { useDashboardOverview } from '@features/owner/dashboard/hooks/useDashboardOverview';
import { useOwnerContext } from '@layouts/OwnerShell';
import { STATUS_LABELS } from '@lib/order-actions';
import { Clock, DollarSign, ReceiptText, Star } from 'lucide-react';

export function DashboardOverviewPage() {
  const { restaurant } = useOwnerContext();
  const { stats, reviewSummary, reviews } = useDashboardOverview(restaurant.id);

  return (
    <div>
      <h1 className="mb-5 text-[1.375rem] font-bold text-text">Dashboard</h1>

      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        <StatTile label="Today's Sales" value={`$${stats.todaySales.toFixed(2)}`} icon={DollarSign} />
        <StatTile label="Orders Today" value={String(stats.todayOrdersCount)} icon={ReceiptText} />
        <StatTile label="Pending Orders" value={String(stats.pendingCount)} icon={Clock} />
        <StatTile label="Avg Order Value" value={`$${stats.avgOrderValue.toFixed(2)}`} icon={DollarSign} />
        <StatTile
          label="Customer Ratings"
          value={
            reviewSummary?.totalReviews
              ? `${reviewSummary.averageRating.toFixed(1)} ★ (${reviewSummary.totalReviews})`
              : 'No ratings yet'
          }
          icon={Star}
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        <ListPanel title="Top Selling Dishes">
          {stats.topDishes.length === 0 ? (
            <ListEmpty>No orders yet.</ListEmpty>
          ) : (
            stats.topDishes.map(([name, qty]) => <ListRow key={name} primary={name} meta={`${qty} sold`} />)
          )}
        </ListPanel>

        <ListPanel title="Recent Orders">
          {stats.recentOrders.length === 0 ? (
            <ListEmpty>No orders yet.</ListEmpty>
          ) : (
            stats.recentOrders.map((order) => (
              <ListRow
                key={order.id}
                primary={`#${order.orderNumber} · ${order.customerName ?? 'Guest'}`}
                meta={`${STATUS_LABELS[order.status]} · $${Number(order.totalAmount).toFixed(2)}`}
              />
            ))
          )}
        </ListPanel>

        <ListPanel title="Recent Reviews">
          {reviews.length === 0 ? (
            <ListEmpty>No reviews yet.</ListEmpty>
          ) : (
            reviews.slice(0, 6).map((review) => (
              <ListRow
                key={review.id}
                primary={`${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)} · ${review.customer.name ?? 'Guest'}`}
                meta={review.comment ?? `Order #${review.order.orderNumber}`}
              />
            ))
          )}
        </ListPanel>
      </div>
    </div>
  );
}
