import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  role: z.enum(['KITCHEN', 'WAITER']),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export const ROLE_LABELS: Record<EmployeeFormValues['role'], string> = {
  KITCHEN: 'Kitchen staff',
  WAITER: 'Waiter',
};
