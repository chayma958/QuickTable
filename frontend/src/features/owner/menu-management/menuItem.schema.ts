import { z } from 'zod';

const optionalNumber = (schema: z.ZodType<number>) =>
  z.preprocess((val) => (val === '' || val === undefined ? undefined : val), schema.optional());

export const menuItemSchema = z.object({
  categoryId: z.string().min(1, 'Choose a category'),
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  discountPrice: optionalNumber(z.coerce.number().min(0)),
  preparationTimeMinutes: z.coerce.number().int().min(0).default(15),
  calories: optionalNumber(z.coerce.number().int().min(0)),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
});

export type MenuItemFormInput = z.input<typeof menuItemSchema>;
export type MenuItemFormValues = z.output<typeof menuItemSchema>;
