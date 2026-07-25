import { trackOrder } from '@api/orders.api';
import { getPublicReviewSummary } from '@api/reviews.api';
import { Skeleton } from '@components/ui/Skeleton';
import { ReviewSection } from '@features/customer/tracking/components/ReviewSection';
import { StatusTimeline } from '@features/customer/tracking/components/StatusTimeline';
import { useOrderTrackingRealtime } from '@hooks/useOrderTrackingRealtime';
import { CustomerLayout } from '@layouts/CustomerLayout/CustomerLayout';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, QrCode, UtensilsCrossed } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useOrderTrackingRealtime(id);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-tracking', id],
    queryFn: () => trackOrder(id!),
    enabled: !!id,
    refetchInterval: 15_000,
  });

  const slug = order?.restaurant?.slug;
  const { data: ratingSummary } = useQuery({
    queryKey: ['public-review-summary', slug],
    queryFn: () => getPublicReviewSummary(slug!),
    enabled: !!slug,
  });

  if (isLoading || !order) {
    return (
      <CustomerLayout restaurantName="Order status" hideCart>
        <div className="mx-auto max-w-xl px-5 py-5">
          <Skeleton className="mb-2 h-6 w-40" />
          <Skeleton className="mb-6 h-3.5 w-28" />
          <div className="mb-5 rounded-2xl border border-border bg-surface p-5">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex gap-3.5 pb-7 last:pb-0">
                <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
                <Skeleton className="mt-0.5 h-3.5 w-40" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="mt-2.5 h-3.5 w-2/3" />
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const menuUrl = order.restaurant?.slug
    ? order.table?.number
      ? `/r/${order.restaurant.slug}/table/${order.table.number}`
      : `/r/${order.restaurant.slug}`
    : '/';
  const rating = ratingSummary
    ? { average: ratingSummary.averageRating, count: ratingSummary.totalReviews }
    : null;

  return (
    <CustomerLayout
      restaurantName={order.restaurant?.name ?? 'Order status'}
      logoUrl={order.restaurant?.logoUrl}
      rating={rating}
      tableId={order.tableId}
      tableNumber={order.table?.number}
      restaurantProfileHref={order.restaurant?.slug ? `/r/${order.restaurant.slug}/about` : undefined}
      onCartIconClick={() => navigate('/cart')}
    >
      <div className="px-5 py-3">
        <Link
          to={menuUrl}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-text"
        >
          <ArrowLeft size={16} />
          Back to menu
        </Link>
      </div>
      <div className="mx-auto max-w-xl px-5 pb-5">
        <div className="mb-6">
          <div className="text-xl font-bold text-text">Order #{order.orderNumber}</div>
          <div className="text-sm text-text-muted">{order.restaurant?.name}</div>
        </div>

        <div className="mb-5 rounded-2xl border border-border bg-surface p-5">
          <StatusTimeline order={order} />
        </div>

        <div className="mb-5 rounded-2xl border border-border bg-surface p-5">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-1.5 text-sm">
              <span>
                <span className="mr-1.5 text-text-muted">{item.quantity}x</span>
                <span className="text-text">{item.nameSnapshot}</span>
              </span>
              <span className="text-text">${Number(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-1.5 flex justify-between border-t border-dashed border-border pt-2.5 text-base font-bold text-text">
            <span>Total</span>
            <span>${Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {order.status === 'DELIVERED' && (
          <div className="mb-5 rounded-2xl border border-border bg-surface p-5">
            <ReviewSection order={order} />
          </div>
        )}

        {order.table?.isOccupied ? (
          <Link
            to={`/r/${order.restaurant?.slug}/table/${order.table.number}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand py-[0.9375rem] text-[0.9375rem] font-bold text-white hover:bg-brand-dark"
          >
            <UtensilsCrossed size={17} />
            Order more from the menu
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-bg-subtle p-5 text-center">
            <p className="mb-3 text-sm font-semibold text-text">This table has been closed.</p>
            <p className="mb-4 text-sm text-text-muted">
              Thanks for dining with us! Scan the QR code on your table to start a new visit.
            </p>
            <Link
              to="/demo/customer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
            >
              <QrCode size={16} />
              Scan a table
            </Link>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
