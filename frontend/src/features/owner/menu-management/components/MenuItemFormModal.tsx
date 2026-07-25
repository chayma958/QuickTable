import { uploadImage } from '@api/uploads.api';
import { Modal } from '@components/Modal/Modal';
import { formStyles as f } from '@components/ui/formStyles';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Category, MenuItem } from '@models/index';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { menuItemSchema, type MenuItemFormInput, type MenuItemFormValues } from '../menuItem.schema';

export function MenuItemFormModal({
  categories,
  initial,
  onClose,
  onSubmit,
}: {
  categories: Category[];
  initial?: MenuItem;
  onClose: () => void;
  onSubmit: (values: MenuItemFormValues) => Promise<void>;
}) {
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemFormInput, unknown, MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: initial
      ? {
          categoryId: initial.categoryId,
          name: initial.name,
          description: initial.description ?? '',
          imageUrl: initial.imageUrl ?? '',
          price: Number(initial.price),
          discountPrice: initial.discountPrice ? Number(initial.discountPrice) : undefined,
          preparationTimeMinutes: initial.preparationTimeMinutes,
          calories: initial.calories ?? undefined,
          isVegetarian: initial.isVegetarian,
          isVegan: initial.isVegan,
          isGlutenFree: initial.isGlutenFree,
          isSpicy: initial.isSpicy,
        }
      : { preparationTimeMinutes: 15, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false },
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImage(file, 'menu-items');
      setImageUrl(url);
      setValue('imageUrl', url);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Modal title={initial ? 'Edit menu item' : 'Add menu item'} onClose={onClose}>
      <form className={f.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={f.field}>
          <label className={f.label} htmlFor="mi-category">
            Category
          </label>
          <select id="mi-category" className={f.select} {...register('categoryId')}>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className={f.error}>{errors.categoryId.message}</span>}
        </div>

        <div className={f.field}>
          <label className={f.label} htmlFor="mi-name">
            Name
          </label>
          <input id="mi-name" className={f.input} {...register('name')} />
          {errors.name && <span className={f.error}>{errors.name.message}</span>}
        </div>

        <div className={f.field}>
          <label className={f.label} htmlFor="mi-description">
            Description
          </label>
          <textarea id="mi-description" className={f.textarea} rows={2} {...register('description')} />
        </div>

        <div className={f.field}>
          <label className={f.label} htmlFor="mi-image">
            Image
          </label>
          <input type="hidden" {...register('imageUrl')} />
          <input id="mi-image" type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
          {isUploading && <span className="text-sm text-text-muted">Uploading...</span>}
          {imageUrl && <img src={imageUrl} alt="" className="h-20 w-20 rounded-lg object-cover" />}
        </div>

        <div className={f.row}>
          <div className={f.field}>
            <label className={f.label} htmlFor="mi-price">
              Price
            </label>
            <input id="mi-price" type="number" step="0.01" className={f.input} {...register('price')} />
            {errors.price && <span className={f.error}>{errors.price.message}</span>}
          </div>
          <div className={f.field}>
            <label className={f.label} htmlFor="mi-discount">
              Discount price
            </label>
            <input id="mi-discount" type="number" step="0.01" className={f.input} {...register('discountPrice')} />
          </div>
        </div>

        <div className={f.row}>
          <div className={f.field}>
            <label className={f.label} htmlFor="mi-prep">
              Prep time (min)
            </label>
            <input id="mi-prep" type="number" className={f.input} {...register('preparationTimeMinutes')} />
          </div>
          <div className={f.field}>
            <label className={f.label} htmlFor="mi-calories">
              Calories
            </label>
            <input id="mi-calories" type="number" className={f.input} {...register('calories')} />
          </div>
        </div>

        <div className={f.row}>
          <label className={f.checkboxLabel}>
            <input type="checkbox" {...register('isVegetarian')} /> Vegetarian
          </label>
          <label className={f.checkboxLabel}>
            <input type="checkbox" {...register('isVegan')} /> Vegan
          </label>
          <label className={f.checkboxLabel}>
            <input type="checkbox" {...register('isGlutenFree')} /> Gluten-free
          </label>
          <label className={f.checkboxLabel}>
            <input type="checkbox" {...register('isSpicy')} /> Spicy
          </label>
        </div>

        <div className={f.actions}>
          <button type="button" className={f.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={f.primaryButton} disabled={isSubmitting}>
            {initial ? 'Save changes' : 'Create item'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
