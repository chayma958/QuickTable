import { OrderStatus } from '@prisma/client';
import { IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsIn(Object.values(OrderStatus))
  status: OrderStatus;
}
