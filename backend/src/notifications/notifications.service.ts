import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

export const NOTIFICATIONS_QUEUE = 'notifications';

export type NotificationJob =
  | {
      name: 'invitation';
      data: {
        to: string;
        restaurantName: string;
        inviterName: string;
        role: string;
        inviteUrl: string;
      };
    }
  | {
      name: 'password-reset';
      data: {
        to: string;
        resetUrl: string;
      };
    };

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue(NOTIFICATIONS_QUEUE) private readonly queue: Queue,
  ) {}

  async enqueue(job: NotificationJob) {
    await this.queue.add(job.name, job.data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      removeOnFail: 50,
    });
  }
}
