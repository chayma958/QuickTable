import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AcceptInvitationDto } from './dto/invitation.dto';
import { InvitationsService } from './invitations.service';

@Controller('invitations')
export class InvitationPublicController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get(':token')
  getByToken(@Param('token') token: string) {
    return this.invitationsService.getByToken(token);
  }

  @Post(':token/accept')
  accept(@Param('token') token: string, @Body() dto: AcceptInvitationDto) {
    return this.invitationsService.accept(token, dto);
  }
}
