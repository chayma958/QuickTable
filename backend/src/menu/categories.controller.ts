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
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  ReorderCategoriesDto,
  UpdateCategoryDto,
} from './dto/category.dto';

@Controller('restaurants/:restaurantId/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.OWNER)
  create(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateCategoryDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.categoriesService.create(restaurantId, dto);
  }

  @Get()
  @Roles(Role.OWNER, Role.WAITER, Role.KITCHEN)
  findAll(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.categoriesService.findAllForStaff(restaurantId);
  }

  @Patch('reorder')
  @Roles(Role.OWNER)
  reorder(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: ReorderCategoriesDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.categoriesService.reorder(restaurantId, dto);
  }

  @Patch(':id')
  @Roles(Role.OWNER)
  update(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.categoriesService.update(restaurantId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  remove(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.categoriesService.remove(restaurantId, id);
  }
}
