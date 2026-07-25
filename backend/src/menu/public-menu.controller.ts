import { Controller, Get, Param } from '@nestjs/common';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { CategoriesService } from './categories.service';

@Controller('menu/public')
export class PublicMenuController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get(':slug')
  async getPublicMenu(@Param('slug') slug: string) {
    const restaurant = await this.restaurantsService.findPublicBySlug(slug);
    const categories = await this.categoriesService.findPublicMenu(
      restaurant.id,
    );
    return { restaurant, categories };
  }
}
