import { Module } from '@nestjs/common';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';
import { PublicMenuController } from './public-menu.controller';

@Module({
  imports: [RestaurantsModule],
  controllers: [
    CategoriesController,
    MenuItemsController,
    PublicMenuController,
  ],
  providers: [CategoriesService, MenuItemsService],
  exports: [CategoriesService, MenuItemsService],
})
export class MenuModule {}
