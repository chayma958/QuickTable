import { Modal } from '@components/Modal/Modal';
import { formStyles as f } from '@components/ui/formStyles';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { couponSchema, type CouponFormInput, type CouponFormValues } from '../coupon.schema';

export function CouponFormModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (values: CouponFormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormInput, unknown, CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: { type: 'PERCENTAGE' },
  });

  return (
    <Modal title="Add coupon" onClose={onClose}>
      <form className={f.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={f.field}>
          <label className={f.label} htmlFor="c-code">
            Code
          </label>
          <input id="c-code" className={f.input} placeholder="WELCOME10" {...register('code')} />
          {errors.code && <span className={f.error}>{errors.code.message}</span>}
        </div>

        <div className={f.row}>
          <div className={f.field}>
            <label className={f.label} htmlFor="c-type">
              Type
            </label>
            <select id="c-type" className={f.select} {...register('type')}>
              <option value="PERCENTAGE">Percentage off</option>
              <option value="FIXED">Fixed amount off</option>
            </select>
          </div>
          <div className={f.field}>
            <label className={f.label} htmlFor="c-value">
              Value
            </label>
            <input id="c-value" type="number" step="0.01" className={f.input} {...register('value')} />
            {errors.value && <span className={f.error}>{errors.value.message}</span>}
          </div>
        </div>

        <div className={f.row}>
          <div className={f.field}>
            <label className={f.label} htmlFor="c-min">
              Minimum order
            </label>
            <input id="c-min" type="number" step="0.01" className={f.input} {...register('minOrderAmount')} />
          </div>
          <div className={f.field}>
            <label className={f.label} htmlFor="c-max-usage">
              Usage limit
            </label>
            <input id="c-max-usage" type="number" className={f.input} {...register('maxUsageCount')} />
          </div>
        </div>

        <div className={f.field}>
          <label className={f.label} htmlFor="c-expires">
            Expires on
          </label>
          <input id="c-expires" type="date" className={f.input} {...register('expiresAt')} />
        </div>

        <div className={f.actions}>
          <button type="button" className={f.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={f.primaryButton} disabled={isSubmitting}>
            Create coupon
          </button>
        </div>
      </form>
    </Modal>
  );
}
