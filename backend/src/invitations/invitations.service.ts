import { randomBytes } from 'crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvitationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { hashToken } from '../auth/utils/hash-token';
import type { AuthenticatedStaff } from '../auth/types/jwt-payload.type';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { AcceptInvitationDto, CreateInvitationDto } from './dto/invitation.dto';

const BCRYPT_ROUNDS = 12;
const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(InvitationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  async create(
    restaurantId: string,
    dto: CreateInvitationDto,
    inviter: AuthenticatedStaff,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser)
      throw new ConflictException('That email is already in use');

    const existingInvite = await this.prisma.invitation.findFirst({
      where: {
        restaurantId,
        email: dto.email,
        status: InvitationStatus.PENDING,
      },
    });
    if (existingInvite) {
      throw new ConflictException(
        'An invitation is already pending for that email',
      );
    }

    const [restaurant, inviterUser] = await Promise.all([
      this.prisma.restaurant.findUniqueOrThrow({ where: { id: restaurantId } }),
      this.prisma.user.findUniqueOrThrow({ where: { id: inviter.id } }),
    ]);

    const rawToken = randomBytes(32).toString('hex');
    const invitation = await this.prisma.invitation.create({
      data: {
        restaurantId,
        email: dto.email,
        name: dto.name,
        role: dto.role,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + INVITATION_TTL_MS),
      },
    });

    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:5173';
    const inviteUrl = `${frontendUrl}/invitations/${rawToken}`;

    this.logger.log(
      `Invitation created for ${dto.email} (${restaurant.name}): ${inviteUrl}`,
    );

    await this.notifications.enqueue({
      name: 'invitation',
      data: {
        to: dto.email,
        restaurantName: restaurant.name,
        inviterName: inviterUser.name,
        role: dto.role,
        inviteUrl,
      },
    });

    return { ...invitation, inviteUrl };
  }

  findAll(restaurantId: string) {
    return this.prisma.invitation.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revoke(restaurantId: string, id: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
    });
    if (!invitation || invitation.restaurantId !== restaurantId) {
      throw new NotFoundException('Invitation not found');
    }
    await this.prisma.invitation.delete({ where: { id } });
  }

  async getByToken(rawToken: string) {
    const invitation = await this.findValidInvitation(rawToken);
    return {
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
      restaurantName: invitation.restaurant.name,
    };
  }

  async accept(rawToken: string, dto: AcceptInvitationDto) {
    const invitation = await this.findValidInvitation(rawToken);

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: invitation.email,
          name: invitation.name,
          role: invitation.role,
          passwordHash,
          restaurantId: invitation.restaurantId,
        },
      });
      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.ACCEPTED, acceptedAt: new Date() },
      });
      return created;
    });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  private async findValidInvitation(rawToken: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { tokenHash: hashToken(rawToken) },
      include: { restaurant: true },
    });
    if (!invitation || invitation.status !== InvitationStatus.PENDING) {
      throw new NotFoundException('Invitation not found or already used');
    }
    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException('This invitation has expired');
    }
    return invitation;
  }
}
