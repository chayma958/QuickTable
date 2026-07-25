import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { KitchenNotesService } from './kitchen-notes.service';
import {
  OrdersController,
  RestaurantOrdersController,
} from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [RealtimeModule],
  controllers: [OrdersController, RestaurantOrdersController],
  providers: [OrdersService, KitchenNotesService],
  exports: [OrdersService],
})
export class OrdersModule {}
