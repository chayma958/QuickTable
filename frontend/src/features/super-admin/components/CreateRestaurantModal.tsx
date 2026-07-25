import { Modal } from '@components/Modal/Modal';
import { formStyles as f } from '@components/ui/formStyles';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createRestaurantSchema, type CreateRestaurantFormValues } from '../createRestaurant.schema';

export function CreateRestaurantModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (values: CreateRestaurantFormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRestaurantFormValues>({
    resolver: zodResolver(createRestaurantSchema),
  });

  return (
    <Modal title="Add restaurant" onClose={onClose}>
      <form className={f.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={f.field}>
          <label className={f.label} htmlFor="r-name">
            Restaurant name
          </label>
          <input id="r-name" className={f.input} {...register('name')} />
          {errors.name && <span className={f.error}>{errors.name.message}</span>}
        </div>
        <div className={f.field}>
          <label className={f.label} htmlFor="r-slug">
            URL slug
          </label>
          <input id="r-slug" className={f.input} placeholder="sushi-house" {...register('slug')} />
          {errors.slug && <span className={f.error}>{errors.slug.message}</span>}
        </div>
        <div className={f.field}>
          <label className={f.label} htmlFor="r-owner-name">
            Owner name
          </label>
          <input id="r-owner-name" className={f.input} {...register('ownerName')} />
          {errors.ownerName && <span className={f.error}>{errors.ownerName.message}</span>}
        </div>
        <div className={f.field}>
          <label className={f.label} htmlFor="r-owner-email">
            Owner email
          </label>
          <input id="r-owner-email" type="email" className={f.input} {...register('ownerEmail')} />
          {errors.ownerEmail && <span className={f.error}>{errors.ownerEmail.message}</span>}
        </div>
        <p className="text-xs text-text-muted">
          We&apos;ll email the owner an invitation link to activate their account and choose their
          own password.
        </p>
        <div className={f.actions}>
          <button type="button" className={f.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={f.primaryButton} disabled={isSubmitting}>
            Create restaurant
          </button>
        </div>
      </form>
    </Modal>
  );
}
