import { CartLineRow } from '@features/customer/cart/components/CartLineRow';
import { useCustomerHeaderInfo } from '@hooks/usePublicRestaurant';
import { CustomerLayout } from '@layouts/CustomerLayout/CustomerLayout';
import { useCart } from '@store/cart-context';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function CartPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const { restaurant, rating } = useCustomerHeaderInfo(cart.restaurantSlug);
  const restaurantProfileHref = cart.restaurantSlug ? `/r/${cart.restaurantSlug}/about` : undefined;

  if (cart.lines.length === 0) {
    return (
      <CustomerLayout
        restaurantName={restaurant?.name ?? 'QuickTable'}
        logoUrl={restaurant?.logoUrl}
        rating={rating}
        tableId={cart.tableId}
        tableNumber={cart.tableNumber}
        restaurantProfileHref={restaurantProfileHref}
        onCartIconClick={() => navigate('/cart')}
      >
        <div className="px-6 py-16 text-center text-text-muted">
          <p>Your cart is empty.</p>
          {cart.restaurantSlug && (
            <Link
              to={cart.tableId ? `/r/${cart.restaurantSlug}/table/${cart.tableNumber}` : `/r/${cart.restaurantSlug}`}
              className="mt-2 inline-flex items-center gap-1.5 font-semibold text-brand"
            >
              <ArrowLeft size={16} />
              Back to menu
            </Link>
          )}
        </div>
      </CustomerLayout>
    );
  }

  const menuUrl = cart.restaurantSlug
    ? cart.tableId
      ? `/r/${cart.restaurantSlug}/table/${cart.tableNumber}`
      : `/r/${cart.restaurantSlug}`
    : '/';

  return (
    <CustomerLayout
      restaurantName={restaurant?.name ?? 'QuickTable'}
      logoUrl={restaurant?.logoUrl}
      rating={rating}
      tableId={cart.tableId}
      tableNumber={cart.tableNumber}
      restaurantProfileHref={restaurantProfileHref}
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
        <h1 className="mb-4 text-xl font-bold text-text">Your order</h1>
        {cart.lines.map((line) => (
          <CartLineRow
            key={line.menuItem.id}
            line={line}
            onQuantityChange={(q) => cart.updateQuantity(line.menuItem.id, q)}
            onRemove={() => cart.removeItem(line.menuItem.id)}
          />
        ))}

        <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4">
          <div className="flex justify-between text-sm text-text-muted">
            <span>Subtotal</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-dashed border-border pt-2 text-[1.0625rem] font-bold text-text">
            <span>Estimated total</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="mt-5 w-full rounded-xl bg-brand py-[0.9375rem] text-center text-[0.9375rem] font-bold text-white hover:bg-brand-dark"
        >
          Proceed to checkout
        </button>
      </div>
    </CustomerLayout>
  );
}
