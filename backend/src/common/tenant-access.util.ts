import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedStaff } from '../auth/types/jwt-payload.type';
import { Role } from '@prisma/client';

export function assertRestaurantAccess(
  user: AuthenticatedStaff,
  restaurantId: string,
): void {
  if (user.role === Role.SUPER_ADMIN) return;
  if (user.restaurantId !== restaurantId) {
    throw new ForbiddenException('You do not have access to this restaurant');
  }
}
