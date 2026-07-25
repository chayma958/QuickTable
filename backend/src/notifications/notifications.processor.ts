import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { EmailService } from './email.service';
import {
  NOTIFICATIONS_QUEUE,
  type NotificationJob,
} from './notifications.service';

@Processor(NOTIFICATIONS_QUEUE)
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(
    job: Job<NotificationJob['data'], void, NotificationJob['name']>,
  ) {
    this.logger.debug(`Processing "${job.name}" job ${job.id}`);

    switch (job.name) {
      case 'invitation':
        return this.emailService.sendInvitation(
          job.data as Extract<NotificationJob, { name: 'invitation' }>['data'],
        );
      case 'password-reset':
        return this.emailService.sendPasswordReset(
          job.data as Extract<
            NotificationJob,
            { name: 'password-reset' }
          >['data'],
        );
    }
  }
}
