import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async create(orderId: string, dto: CreateReviewDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (!order.customerId) {
      throw new BadRequestException(
        'This order has no customer to attach a review to',
      );
    }
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('You can only review a delivered order');
    }

    const existing = await this.prisma.review.findUnique({
      where: { orderId },
    });
    if (existing)
      throw new ConflictException('This order has already been reviewed');

    const review = await this.prisma.review.create({
      data: {
        orderId,
        customerId: order.customerId,
        restaurantId: order.restaurantId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    this.realtime.emitReviewNew(review);
    return review;
  }

  findAllForRestaurant(restaurantId: string) {
    return this.prisma.review.findMany({
      where: { restaurantId },
      include: {
        customer: { select: { name: true } },
        order: { select: { orderNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSummary(restaurantId: string) {
    const result = await this.prisma.review.aggregate({
      where: { restaurantId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return {
      averageRating: result._avg.rating ?? 0,
      totalReviews: result._count.rating,
    };
  }

  async getSummaryBySlug(slug: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return this.getSummary(restaurant.id);
  }

  async getPublicReviewsBySlug(slug: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return this.prisma.review.findMany({
      where: { restaurantId: restaurant.id },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
