import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEmployeeDto } from './dto/employee.dto';

const STAFF_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  isActive: true,
  avatarUrl: true,
  createdAt: true,
} as const;

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(restaurantId: string) {
    return this.prisma.user.findMany({
      where: { restaurantId, role: { not: Role.OWNER } },
      select: STAFF_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(restaurantId: string, id: string, dto: UpdateEmployeeDto) {
    await this.assertBelongsToRestaurant(restaurantId, id);
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: STAFF_SELECT,
    });
  }

  async remove(restaurantId: string, id: string) {
    await this.assertBelongsToRestaurant(restaurantId, id);
    await this.prisma.user.delete({ where: { id } });
  }

  private async assertBelongsToRestaurant(
    restaurantId: string,
    userId: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (
      !user ||
      user.restaurantId !== restaurantId ||
      user.role === Role.OWNER
    ) {
      throw new NotFoundException('Employee not found');
    }
    return user;
  }
}
