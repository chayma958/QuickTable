import { Modal } from '@components/Modal/Modal';
import { formStyles as f } from '@components/ui/formStyles';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Category } from '@models/index';
import { useForm } from 'react-hook-form';
import { categorySchema, type CategoryFormValues } from '../category.schema';

export function CategoryFormModal({
  initial,
  onClose,
  onSubmit,
}: {
  initial?: Category;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initial ? { name: initial.name, description: initial.description ?? '' } : undefined,
  });

  return (
    <Modal title={initial ? 'Edit category' : 'Add category'} onClose={onClose}>
      <form className={f.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={f.field}>
          <label className={f.label} htmlFor="cat-name">
            Name
          </label>
          <input id="cat-name" className={f.input} {...register('name')} />
          {errors.name && <span className={f.error}>{errors.name.message}</span>}
        </div>
        <div className={f.field}>
          <label className={f.label} htmlFor="cat-description">
            Description
          </label>
          <textarea id="cat-description" className={f.textarea} rows={2} {...register('description')} />
        </div>
        <div className={f.actions}>
          <button type="button" className={f.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={f.primaryButton} disabled={isSubmitting}>
            {initial ? 'Save changes' : 'Create category'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
