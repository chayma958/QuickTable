import { IsString } from 'class-validator';

export class TransferTableDto {
  @IsString()
  tableId: string;
}
