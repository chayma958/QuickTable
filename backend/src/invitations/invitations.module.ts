import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { InvitationPublicController } from './invitation-public.controller';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';

@Module({
  imports: [NotificationsModule],
  controllers: [InvitationsController, InvitationPublicController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
