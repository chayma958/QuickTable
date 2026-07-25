import { useCheckoutForm } from '@features/customer/checkout/hooks/useCheckoutForm';
import { CustomerLayout } from '@layouts/CustomerLayout/CustomerLayout';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const inputClass =
  'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-light';
const labelClass = 'text-sm font-semibold text-text';
const errorClass = 'text-xs text-danger';

export function CheckoutPage() {
  const checkout = useCheckoutForm();
  const { cart, restaurant, rating } = checkout;
  const navigate = useNavigate();
  const menuUrl = cart.restaurantSlug
    ? cart.tableId
      ? `/r/${cart.restaurantSlug}/table/${cart.tableNumber}`
      : `/r/${cart.restaurantSlug}`
    : '/';
  const restaurantProfileHref = cart.restaurantSlug ? `/r/${cart.restaurantSlug}/about` : undefined;

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
        <h1 className="mb-4 text-xl font-bold text-text">Checkout</h1>
        <form
          className="flex flex-col gap-[1.125rem]"
          onSubmit={checkout.handleSubmit(checkout.submit)}
        >
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="customerName">
              Your name
            </label>
            <input id="customerName" className={inputClass} {...checkout.register('customerName')} />
            {checkout.errors.customerName && (
              <span className={errorClass}>{checkout.errors.customerName.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="customerPhone">
              Phone number
            </label>
            <input id="customerPhone" className={inputClass} {...checkout.register('customerPhone')} />
            {checkout.errors.customerPhone && (
              <span className={errorClass}>{checkout.errors.customerPhone.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="couponCode">
              Coupon code (optional)
            </label>
            <input id="couponCode" className={inputClass} {...checkout.register('couponCode')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="notes">
              Order notes (optional)
            </label>
            <textarea
              id="notes"
              rows={2}
              className={`${inputClass} resize-none`}
              {...checkout.register('notes')}
            />
          </div>

          <div className="flex flex-col gap-1.5 border-t border-border pt-4">
            <div className="flex justify-between text-sm text-text-muted">
              <span>Subtotal</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-text-muted">
              <span>Estimated tax</span>
              <span>${checkout.estimatedTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-border pt-2 text-[1.0625rem] font-bold text-text">
              <span>Estimated total</span>
              <span>${checkout.estimatedTotal.toFixed(2)}</span>
            </div>
          </div>

          {checkout.serverError && (
            <span className="text-center text-sm text-danger">{checkout.serverError}</span>
          )}

          <button
            type="submit"
            disabled={checkout.isSubmitting || checkout.mutation.isPending}
            className="rounded-xl bg-brand py-[0.9375rem] text-[0.9375rem] font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checkout.mutation.isPending ? 'Placing order...' : 'Place order'}
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
}
