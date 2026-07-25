import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

const STAFF_ROLES = [Role.KITCHEN, Role.WAITER];

export class CreateInvitationDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(STAFF_ROLES, {
    message: `role must be one of: ${STAFF_ROLES.join(', ')}`,
  })
  role: Role;
}

export class AcceptInvitationDto {
  @IsString()
  @MinLength(8)
  password: string;
}
