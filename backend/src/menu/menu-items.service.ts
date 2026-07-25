import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(restaurantId: string, dto: CreateMenuItemDto) {
    await this.assertCategoryBelongsToRestaurant(restaurantId, dto.categoryId);
    return this.prisma.menuItem.create({ data: { ...dto, restaurantId } });
  }

  findAllForStaff(restaurantId: string) {
    return this.prisma.menuItem.findMany({
      where: { restaurantId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(restaurantId: string, id: string, dto: UpdateMenuItemDto) {
    await this.assertBelongsToRestaurant(restaurantId, id);
    if (dto.categoryId) {
      await this.assertCategoryBelongsToRestaurant(
        restaurantId,
        dto.categoryId,
      );
    }
    return this.prisma.menuItem.update({ where: { id }, data: dto });
  }

  async setAvailability(
    restaurantId: string,
    id: string,
    isAvailable: boolean,
  ) {
    await this.assertBelongsToRestaurant(restaurantId, id);
    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable },
    });
  }

  async remove(restaurantId: string, id: string) {
    await this.assertBelongsToRestaurant(restaurantId, id);
    await this.prisma.menuItem.delete({ where: { id } });
  }

  private async assertBelongsToRestaurant(
    restaurantId: string,
    menuItemId: string,
  ) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });
    if (!item || item.restaurantId !== restaurantId) {
      throw new NotFoundException('Menu item not found');
    }
    return item;
  }

  private async assertCategoryBelongsToRestaurant(
    restaurantId: string,
    categoryId: string,
  ) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category || category.restaurantId !== restaurantId) {
      throw new BadRequestException(
        'Category does not belong to this restaurant',
      );
    }
  }
}
