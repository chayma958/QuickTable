import { Role } from '@prisma/client';

export interface StaffJwtPayload {
  [key: string]: unknown;
  sub: string;
  type: 'staff';
  role: Role;
  restaurantId: string | null;
}

export interface AuthenticatedStaff {
  id: string;
  type: 'staff';
  role: Role;
  restaurantId: string | null;
}
