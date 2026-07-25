import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(restaurantId: string, dto: CreateCouponDto) {
    const existing = await this.prisma.coupon.findUnique({
      where: { restaurantId_code: { restaurantId, code: dto.code } },
    });
    if (existing)
      throw new ConflictException(`Coupon code "${dto.code}" already exists`);

    return this.prisma.coupon.create({
      data: {
        restaurantId,
        code: dto.code,
        type: dto.type,
        value: dto.value,
        minOrderAmount: dto.minOrderAmount,
        maxUsageCount: dto.maxUsageCount,
        maxUsagePerCustomer: dto.maxUsagePerCustomer,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });
  }

  findAll(restaurantId: string) {
    return this.prisma.coupon.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(restaurantId: string, id: string, dto: UpdateCouponDto) {
    await this.assertBelongsToRestaurant(restaurantId, id);
    return this.prisma.coupon.update({
      where: { id },
      data: {
        ...dto,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });
  }

  async remove(restaurantId: string, id: string) {
    await this.assertBelongsToRestaurant(restaurantId, id);
    await this.prisma.coupon.delete({ where: { id } });
  }

  private async assertBelongsToRestaurant(restaurantId: string, id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon || coupon.restaurantId !== restaurantId) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }
}
