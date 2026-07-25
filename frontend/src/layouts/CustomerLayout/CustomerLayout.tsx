import { ThemeToggle } from '@components/ui/ThemeToggle';
import { TableRequestButton } from '@features/customer/table-requests/components/TableRequestButton';
import { getOrderHistory } from '@lib/last-order';
import { useCart } from '@store/cart-context';
import { ReceiptText, ShoppingBag, Star, Store } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function CustomerLayout({
  restaurantName,
  logoUrl,
  tableId,
  tableNumber,
  rating,
  hideCart,
  onCartIconClick,
  restaurantProfileHref,
  headerExtra,
  children,
}: {
  restaurantName: string;
  logoUrl?: string | null;
  tableId?: string | null;
  tableNumber?: number | null;
  rating?: { average: number; count: number } | null;
  hideCart?: boolean;
  onCartIconClick?: () => void;
  restaurantProfileHref?: string;
  headerExtra?: ReactNode;
  children?: ReactNode;
}) {
  const { itemCount, subtotal } = useCart();
  const location = useLocation();
  const hasOrderHistory = getOrderHistory().length > 0;
  const showTrackOrder =
    hasOrderHistory && !location.pathname.startsWith('/orders/') && location.pathname !== '/orders';

  return (
    <div className="min-h-screen bg-bg-subtle pb-24">
      <header className="sticky top-0 z-30 flex flex-col bg-surface/95 backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
          {logoUrl && <img src={logoUrl} alt="" className="h-9 w-9 rounded-lg object-cover" />}
          <span className="truncate text-base font-semibold text-text">{restaurantName}</span>
          {rating && rating.count > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-xs font-semibold text-warning">
              <Star size={12} fill="currentColor" />
              {rating.average.toFixed(1)} ({rating.count})
            </span>
          )}
          <div className="ml-auto flex items-center gap-2.5">
            <ThemeToggle />
            {tableNumber && (
              <span className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-dark">
                Table {tableNumber}
              </span>
            )}
            {tableId && <TableRequestButton tableId={tableId} />}
            {showTrackOrder && (
              <Link
                to="/orders"
                aria-label="My orders"
                className="flex h-9 w-9 items-center justify-center rounded-full text-text hover:bg-bg-subtle"
              >
                <ReceiptText size={18} />
              </Link>
            )}
            {restaurantProfileHref && (
              <Link
                to={restaurantProfileHref}
                aria-label="View restaurant page"
                className="flex h-9 w-9 items-center justify-center rounded-full text-text hover:bg-bg-subtle"
              >
                <Store size={18} />
              </Link>
            )}
            {onCartIconClick && (
              <button
                type="button"
                onClick={onCartIconClick}
                aria-label="Open cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-text hover:bg-bg-subtle"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[0.625rem] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
        {headerExtra}
      </header>

      <main>{children ?? <Outlet />}</main>

      {!hideCart && !onCartIconClick && itemCount > 0 && (
        <Link
          to="/cart"
          className="fixed inset-x-5 bottom-5 z-20 flex items-center justify-between rounded-2xl bg-brand px-5 py-4 font-semibold text-white shadow-elevated sm:inset-x-auto sm:right-6 sm:w-80"
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag size={17} />
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1.5 text-xs">
              {itemCount}
            </span>
            View cart
          </span>
          <span>${subtotal.toFixed(2)}</span>
        </Link>
      )}
    </div>
  );
}
