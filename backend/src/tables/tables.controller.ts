import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedStaff } from '../auth/types/jwt-payload.type';
import { assertRestaurantAccess } from '../common/tenant-access.util';
import {
  AssignWaiterDto,
  CreateTableDto,
  CreateTableRequestDto,
  UpdateTableDto,
} from './dto/table.dto';
import { TablesService } from './tables.service';

@Controller('restaurants/:restaurantId/tables')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @Roles(Role.OWNER)
  create(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateTableDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.tablesService.create(restaurantId, dto);
  }

  @Get()
  @Roles(Role.OWNER, Role.WAITER)
  findAll(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.tablesService.findAll(restaurantId);
  }

  @Get('overview')
  @Roles(Role.OWNER, Role.WAITER)
  getOverview(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.tablesService.getOverview(restaurantId);
  }

  @Patch(':id')
  @Roles(Role.OWNER)
  setActive(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTableDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.tablesService.setActive(restaurantId, id, dto.isActive ?? true);
  }

  @Patch(':id/assign')
  @Roles(Role.OWNER)
  assignWaiter(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: AssignWaiterDto,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.tablesService.assignWaiter(restaurantId, id, dto);
  }

  @Patch(':id/close')
  @Roles(Role.OWNER, Role.WAITER)
  closeTable(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.tablesService.closeTable(restaurantId, id);
  }

  @Patch(':id/requests/:requestId/resolve')
  @Roles(Role.OWNER, Role.WAITER)
  resolveRequest(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Param('requestId') requestId: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.tablesService.resolveRequest(restaurantId, id, requestId);
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  remove(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedStaff,
  ) {
    assertRestaurantAccess(user, restaurantId);
    return this.tablesService.remove(restaurantId, id);
  }
}

@Controller('tables/public')
export class PublicTablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get(':slug/:number')
  findPublicByNumber(
    @Param('slug') slug: string,
    @Param('number') number: string,
  ) {
    return this.tablesService.findPublicByNumber(slug, Number(number));
  }

  @Post(':tableId/requests')
  createRequest(
    @Param('tableId') tableId: string,
    @Body() dto: CreateTableRequestDto,
  ) {
    return this.tablesService.createRequest(tableId, dto);
  }
}
