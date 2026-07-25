import { z } from 'zod';

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, 'At least 3 characters')
    .regex(/^[A-Z0-9_-]+$/, 'Uppercase letters, numbers, hyphens only'),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.coerce.number().min(0),
  minOrderAmount: z.coerce.number().min(0).optional().or(z.literal('').transform(() => undefined)),
  maxUsageCount: z.coerce.number().int().min(1).optional().or(z.literal('').transform(() => undefined)),
  expiresAt: z.string().optional(),
});

export type CouponFormInput = z.input<typeof couponSchema>;
export type CouponFormValues = z.output<typeof couponSchema>;
