import { TableRequestType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTableDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  number: number;
}

export class UpdateTableDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateTableRequestDto {
  @IsIn(Object.values(TableRequestType))
  type: TableRequestType;
}

export class AssignWaiterDto {
  @IsOptional()
  @IsString()
  waiterId: string | null = null;
}
