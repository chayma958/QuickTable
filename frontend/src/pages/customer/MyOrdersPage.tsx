import { trackOrder } from '@api/orders.api';
import { getPublicReviewSummary } from '@api/reviews.api';
import { EmptyState } from '@components/ui/EmptyState';
import { Skeleton } from '@components/ui/Skeleton';
import { STATUS_BADGE_CLASS } from '@lib/order-status-style';
import { getOrderHistory } from '@lib/last-order';
import { CustomerLayout } from '@layouts/CustomerLayout/CustomerLayout';
import { useQueries, useQuery } from '@tanstack/react-query';
import { ArrowLeft, ReceiptText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY: 'Ready',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export function MyOrdersPage() {
  const orderIds = getOrderHistory();
  const navigate = useNavigate();

  const results = useQueries({
    queries: orderIds.map((id) => ({
      queryKey: ['order-tracking', id],
      queryFn: () => trackOrder(id),
      retry: false,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const orders = results.filter((r) => r.data).map((r) => r.data!);
  const mostRecent = orders[0];
  const slug = mostRecent?.restaurant?.slug;
  const menuUrl = slug
    ? mostRecent.table?.number
      ? `/r/${slug}/table/${mostRecent.table.number}`
      : `/r/${slug}`
    : null;

  const { data: ratingSummary } = useQuery({
    queryKey: ['public-review-summary', slug],
    queryFn: () => getPublicReviewSummary(slug!),
    enabled: !!slug,
  });
  const rating = ratingSummary
    ? { average: ratingSummary.averageRating, count: ratingSummary.totalReviews }
    : null;

  return (
    <CustomerLayout
      restaurantName={mostRecent?.restaurant?.name ?? 'QuickTable'}
      logoUrl={mostRecent?.restaurant?.logoUrl}
      rating={rating}
      tableId={mostRecent?.tableId}
      tableNumber={mostRecent?.table?.number}
      restaurantProfileHref={slug ? `/r/${slug}/about` : undefined}
      onCartIconClick={() => navigate('/cart')}
    >
      {menuUrl && (
        <div className="px-5 py-3">
          <Link
            to={menuUrl}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-text"
          >
            <ArrowLeft size={16} />
            Back to menu
          </Link>
        </div>
      )}
      <div className="mx-auto max-w-2xl px-5 py-6">
        <h1 className="mb-5 text-xl font-bold text-text">My Orders</h1>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 2 }, (_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="No orders yet"
            description="Orders you place will show up here so you can track them anytime."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}/track`}
                className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-soft transition-shadow hover:shadow-elevated"
              >
                <div>
                  <div className="text-[0.9375rem] font-bold text-text">
                    Order #{order.orderNumber} · {order.restaurant?.name}
                  </div>
                  <div className="mt-0.5 text-sm text-text-muted">
                    {order.items.length} item{order.items.length === 1 ? '' : 's'} · $
                    {Number(order.totalAmount).toFixed(2)}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-bold uppercase ${STATUS_BADGE_CLASS[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
