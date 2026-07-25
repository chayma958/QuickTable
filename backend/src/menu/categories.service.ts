import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCategoryDto,
  ReorderCategoriesDto,
  UpdateCategoryDto,
} from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(restaurantId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: { ...dto, restaurantId } });
  }

  findAllForStaff(restaurantId: string) {
    return this.prisma.category.findMany({
      where: { restaurantId },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { menuItems: true } } },
    });
  }

  findPublicMenu(restaurantId: string) {
    return this.prisma.category.findMany({
      where: { restaurantId, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async update(restaurantId: string, id: string, dto: UpdateCategoryDto) {
    await this.assertBelongsToRestaurant(restaurantId, id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(restaurantId: string, id: string) {
    await this.assertBelongsToRestaurant(restaurantId, id);
    await this.prisma.category.delete({ where: { id } });
  }

  async reorder(restaurantId: string, dto: ReorderCategoriesDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.category.updateMany({
          where: { id: item.id, restaurantId },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );
    return this.findAllForStaff(restaurantId);
  }

  private async assertBelongsToRestaurant(
    restaurantId: string,
    categoryId: string,
  ) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category || category.restaurantId !== restaurantId) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
