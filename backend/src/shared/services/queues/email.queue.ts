import { IEmailJob } from '@root/feature/user/interfaces/user.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { emailWorker } from '@worker/email.worker';
class EmailQueue extends BaseQueue {
  constructor() {
    super('Email');
    this.processJob('forgetPasswordEmail', 5, emailWorker.addNotificationEmai);
  }

  public addEmailjob(name: string, data: IEmailJob): void {
    this.addEmailjob(name, data);
  }
}

export const emailQueue: EmailQueue = new EmailQueue();
