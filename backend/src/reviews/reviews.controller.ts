import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedStaff } from '../auth/types/jwt-payload.type';
import { assertRestaurantAccess } from '../common/tenant-access.util';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('orders/:orderId/reviews')
  create(@Param('orderId') orderId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(orderId, dto);
  }

  @Get('reviews/public/:slug/summary')
  getPublicSummary(@Param('slug') slug: string) {
    return this.reviewsService.getSummaryBySlug(slug);
  }

  @Get('reviews/public/:slug')
  getPublicReviews(@Param('slug') slug: string) {
    return this.reviewsService.getPublicReviewsBySlug(slug);
  }

  @Get('restaurants/:restaurantId/reviews')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  findAllForRestaurant(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.reviewsService.findAllForRestaurant(restaurantId);
  }

  @Get('restaurants/:restaurantId/reviews/summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  getSummary(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.reviewsService.getSummary(restaurantId);
  }
}
