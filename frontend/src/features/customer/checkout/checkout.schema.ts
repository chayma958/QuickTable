import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Enter your name'),
  customerPhone: z.string().min(6, 'Enter a valid phone number'),
  paymentMethod: z.enum(['CASH']),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
