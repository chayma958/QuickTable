import { EmptyState } from '@components/ui/EmptyState';
import { CouponFormModal } from '@features/owner/coupons/components/CouponFormModal';
import { CouponRow } from '@features/owner/coupons/components/CouponRow';
import { useCouponsPage } from '@features/owner/coupons/hooks/useCouponsPage';
import { useOwnerContext } from '@layouts/OwnerShell';
import { Ticket } from 'lucide-react';

export function CouponsPage() {
  const { restaurant } = useOwnerContext();
  const { coupons, modalOpen, openModal, closeModal, handleSubmit, toggleActive, deleteCoupon } = useCouponsPage(
    restaurant.id,
  );

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[1.375rem] font-bold text-text">Coupons</h1>
        <button
          type="button"
          onClick={openModal}
          className="rounded-lg bg-brand px-4.5 py-2.5 text-[0.8125rem] font-semibold text-white hover:bg-brand-dark"
        >
          + Add coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No coupons yet"
          description="Create a discount code to drive repeat orders and reward loyal customers."
          action={
            <button
              type="button"
              onClick={openModal}
              className="rounded-lg bg-brand px-4.5 py-2.5 text-[0.8125rem] font-semibold text-white hover:bg-brand-dark"
            >
              + Add coupon
            </button>
          }
        />
      ) : (
        coupons.map((coupon) => (
          <CouponRow
            key={coupon.id}
            coupon={coupon}
            onToggleActive={(isActive) => toggleActive(coupon.id, isActive)}
            onDelete={() => deleteCoupon(coupon.id)}
          />
        ))
      )}

      {modalOpen && <CouponFormModal onClose={closeModal} onSubmit={handleSubmit} />}
    </div>
  );
}
