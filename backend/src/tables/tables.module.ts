import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { PublicTablesController, TablesController } from './tables.controller';
import { TablesService } from './tables.service';

@Module({
  imports: [RealtimeModule],
  controllers: [TablesController, PublicTablesController],
  providers: [TablesService],
  exports: [TablesService],
})
export class TablesModule {}
