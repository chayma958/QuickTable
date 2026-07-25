import { KitchenNoteReason } from '@prisma/client';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateKitchenNoteDto {
  @IsIn(Object.values(KitchenNoteReason))
  reason: KitchenNoteReason;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  message?: string;
}
