import { z } from 'zod';

export const createRestaurantSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Lowercase letters, numbers, hyphens only'),
  ownerName: z.string().min(2, 'Owner name is required'),
  ownerEmail: z.string().email('Enter a valid email'),
});

export type CreateRestaurantFormValues = z.infer<typeof createRestaurantSchema>;
