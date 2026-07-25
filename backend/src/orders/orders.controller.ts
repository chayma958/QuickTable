import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedStaff } from '../auth/types/jwt-payload.type';
import { assertRestaurantAccess } from '../common/tenant-access.util';
import { CreateKitchenNoteDto } from './dto/create-kitchen-note.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { TransferTableDto } from './dto/transfer-table.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { KitchenNotesService } from './kitchen-notes.service';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get('track/:id')
  track(@Param('id') id: string) {
    return this.ordersService.findPublicTracking(id);
  }
}

@Controller('restaurants/:restaurantId/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantOrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly kitchenNotesService: KitchenNotesService,
  ) {}

  @Get()
  @Roles(Role.OWNER, Role.KITCHEN, Role.WAITER)
  findAll(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthenticatedStaff,
    @Query('status') status?: OrderStatus,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.ordersService.findAllForRestaurant(restaurantId, status);
  }

  @Get('audit-logs')
  @Roles(Role.OWNER)
  findAuditLogs(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthenticatedStaff,
    @Query('orderId') orderId?: string,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.ordersService.findAuditLogs(restaurantId, orderId);
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.KITCHEN, Role.WAITER)
  findOne(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.ordersService.findOneForStaff(restaurantId, id);
  }

  @Patch(':id/status')
  @Roles(Role.OWNER, Role.KITCHEN, Role.WAITER)
  updateStatus(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.ordersService.updateStatus(restaurantId, id, dto, user);
  }

  @Delete(':id/items/:itemId')
  @Roles(Role.OWNER, Role.WAITER)
  removeItem(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.ordersService.removeItem(restaurantId, id, itemId, user);
  }

  @Patch(':id/mark-paid')
  @Roles(Role.OWNER, Role.WAITER)
  markPaid(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.ordersService.markPaid(restaurantId, id);
  }

  @Patch(':id/transfer-table')
  @Roles(Role.OWNER, Role.WAITER)
  transferTable(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: TransferTableDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.ordersService.transferTable(restaurantId, id, dto, user);
  }

  @Post(':id/notes')
  @Roles(Role.OWNER, Role.KITCHEN)
  createNote(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: CreateKitchenNoteDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.kitchenNotesService.create(restaurantId, id, dto, user);
  }

  @Patch(':id/notes/:noteId/acknowledge')
  @Roles(Role.OWNER, Role.WAITER)
  acknowledgeNote(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Param('noteId') noteId: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.kitchenNotesService.acknowledge(restaurantId, id, noteId);
  }
}
