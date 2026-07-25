import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedStaff } from '../auth/types/jwt-payload.type';
import { Role } from '@prisma/client';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import {
  ToggleRestaurantActiveDto,
  UpdateRestaurantDto,
} from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  create(
    @Body() dto: CreateRestaurantDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    return this.restaurantsService.create(dto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findMine(@CurrentUser() user: AuthenticatedStaff) {
    if (user.type !== 'staff' || !user.restaurantId) {
      throw new NotFoundException('No restaurant associated with this account');
    }
    return this.restaurantsService.findById(user.restaurantId);
  }

  @Get('public/:slug')
  findPublicBySlug(@Param('slug') slug: string) {
    return this.restaurantsService.findPublicBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.SUPER_ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    return this.restaurantsService.update(id, dto, user);
  }

  @Patch(':id/active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  setActive(@Param('id') id: string, @Body() dto: ToggleRestaurantActiveDto) {
    return this.restaurantsService.setActive(id, dto.isActive);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }
}
