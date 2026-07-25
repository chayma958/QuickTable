import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedStaff } from '../auth/types/jwt-payload.type';
import { assertRestaurantAccess } from '../common/tenant-access.util';
import {
  CreateMenuItemDto,
  UpdateAvailabilityDto,
  UpdateMenuItemDto,
} from './dto/menu-item.dto';
import { MenuItemsService } from './menu-items.service';

@Controller('restaurants/:restaurantId/menu-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @Roles(Role.OWNER)
  create(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateMenuItemDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.menuItemsService.create(restaurantId, dto);
  }

  @Get()
  @Roles(Role.OWNER, Role.WAITER, Role.KITCHEN)
  findAll(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.menuItemsService.findAllForStaff(restaurantId);
  }

  @Patch(':id')
  @Roles(Role.OWNER)
  update(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMenuItemDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.menuItemsService.update(restaurantId, id, dto);
  }

  @Patch(':id/availability')
  @Roles(Role.OWNER)
  setAvailability(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAvailabilityDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.menuItemsService.setAvailability(
      restaurantId,
      id,
      dto.isAvailable,
    );
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  remove(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.menuItemsService.remove(restaurantId, id);
  }
}
