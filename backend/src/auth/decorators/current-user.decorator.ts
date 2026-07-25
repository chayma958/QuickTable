import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedStaff } from '../types/jwt-payload.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedStaff => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: AuthenticatedStaff }>();
    return request.user;
  },
);
