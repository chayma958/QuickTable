import { z } from 'zod';

export const settingsSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().min(1),
  taxRate: z.coerce.number().min(0).max(100),
  hasParking: z.boolean().default(false),
  hasWifi: z.boolean().default(false),
  isWheelchairAccessible: z.boolean().default(false),
  isPetFriendly: z.boolean().default(false),
  acceptsCardPayment: z.boolean().default(false),
});

export type SettingsFormInput = z.input<typeof settingsSchema>;
export type SettingsFormValues = z.output<typeof settingsSchema>;

export const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
