import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { assertRestaurantAccess } from '../common/tenant-access.util';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedStaff } from '../auth/types/jwt-payload.type';
import { InvitationsService } from '../invitations/invitations.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invitations: InvitationsService,
  ) {}

  async create(dto: CreateRestaurantDto, requester: AuthenticatedStaff) {
    const existingSlug = await this.prisma.restaurant.findUnique({
      where: { slug: dto.slug },
    });
    if (existingSlug)
      throw new ConflictException('That restaurant slug is already taken');

    const existingOwnerEmail = await this.prisma.user.findUnique({
      where: { email: dto.ownerEmail },
    });
    if (existingOwnerEmail)
      throw new ConflictException('That owner email is already in use');

    const restaurant = await this.prisma.restaurant.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        city: dto.city,
        country: dto.country,
        currency: dto.currency ?? 'USD',
        subscriptionPlanId: dto.subscriptionPlanId,
      },
    });

    const invitation = await this.invitations.create(
      restaurant.id,
      { name: dto.ownerName, email: dto.ownerEmail, role: Role.OWNER },
      requester,
    );

    return { restaurant, invitation };
  }

  findAll() {
    return this.prisma.restaurant.findMany({
      include: {
        subscriptionPlan: true,
        _count: { select: { orders: true, staff: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async findPublicBySlug(slug: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        logoUrl: true,
        coverImageUrl: true,
        galleryImages: true,
        currency: true,
        taxRate: true,
        openingHours: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        hasParking: true,
        hasWifi: true,
        isWheelchairAccessible: true,
        isPetFriendly: true,
        acceptsCardPayment: true,
      },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async update(
    id: string,
    dto: UpdateRestaurantDto,
    requester: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(requester, id);
    await this.findById(id);
    return this.prisma.restaurant.update({ where: { id }, data: dto });
  }

  async setActive(id: string, isActive: boolean) {
    await this.findById(id);
    return this.prisma.restaurant.update({ where: { id }, data: { isActive } });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.restaurant.delete({ where: { id } });
  }
}
