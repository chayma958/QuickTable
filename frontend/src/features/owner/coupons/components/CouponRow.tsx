import type { Coupon } from '@api/coupons.api';

const TYPE_LABELS: Record<Coupon['type'], string> = {
  PERCENTAGE: 'off',
  FIXED: '$ off',
};

export function CouponRow({
  coupon,
  onToggleActive,
  onDelete,
}: {
  coupon: Coupon;
  onToggleActive: (isActive: boolean) => void;
  onDelete: () => void;
}) {
  const valueLabel =
    coupon.type === 'PERCENTAGE'
      ? `${Number(coupon.value)}% ${TYPE_LABELS[coupon.type]}`
      : `$${Number(coupon.value).toFixed(2)} ${TYPE_LABELS[coupon.type]}`;

  return (
    <div
      className={`mb-2.5 flex items-center gap-4 rounded-xl border border-border bg-bg p-3.5 ${!coupon.isActive ? 'opacity-50' : ''}`}
    >
      <span className="font-mono text-[0.9375rem] font-bold tracking-wide text-text">{coupon.code}</span>
      <span className="flex-1 text-xs text-text-muted">
        {valueLabel} · used {coupon.usageCount}
        {coupon.maxUsageCount ? `/${coupon.maxUsageCount}` : ''} times
        {coupon.expiresAt && ` · expires ${new Date(coupon.expiresAt).toLocaleDateString()}`}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onToggleActive(!coupon.isActive)}
          className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg-subtle"
        >
          {coupon.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-danger px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/10"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
