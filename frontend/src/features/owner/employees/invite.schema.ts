import { z } from 'zod';

export const inviteEmployeeSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  role: z.enum(['KITCHEN', 'WAITER']),
});

export type InviteEmployeeFormValues = z.infer<typeof inviteEmployeeSchema>;
