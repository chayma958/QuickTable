import { Role } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

const STAFF_ROLES = [Role.KITCHEN, Role.WAITER];

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(STAFF_ROLES, {
    message: `role must be one of: ${STAFF_ROLES.join(', ')}`,
  })
  role?: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
