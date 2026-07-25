import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedStaff } from '../auth/types/jwt-payload.type';
import { assertRestaurantAccess } from '../common/tenant-access.util';
import { CreateInvitationDto } from './dto/invitation.dto';
import { InvitationsService } from './invitations.service';

@Controller('restaurants/:restaurantId/invitations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  create(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateInvitationDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.invitationsService.create(restaurantId, dto, user);
  }

  @Get()
  findAll(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.invitationsService.findAll(restaurantId);
  }

  @Delete(':id')
  revoke(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.invitationsService.revoke(restaurantId, id);
  }
}
