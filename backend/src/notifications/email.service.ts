import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Resend } from 'resend';
import { RESEND_CLIENT } from './resend.provider';
import {
  invitationEmail,
  passwordResetEmail,
} from './templates/email-templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromAddress: string;

  constructor(
    @Inject(RESEND_CLIENT) private readonly resend: Resend,
    config: ConfigService,
  ) {
    this.fromAddress =
      config.get<string>('RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev';
  }

  async sendInvitation(params: {
    to: string;
    restaurantName: string;
    inviterName: string;
    role: string;
    inviteUrl: string;
  }) {
    await this.send(
      params.to,
      `You've been invited to join ${params.restaurantName} on QuickTable`,
      invitationEmail(params),
    );
  }

  async sendPasswordReset(params: { to: string; resetUrl: string }) {
    await this.send(
      params.to,
      'Reset your QuickTable password',
      passwordResetEmail(params),
    );
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject,
        html,
      });
    } catch (err) {
      this.logger.warn(
        `Failed to send email to ${to}: ${(err as Error).message}`,
      );
    }
  }
}
