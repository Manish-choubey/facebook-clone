import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { mailTranslate } from '@service/email/mai.transport';

const log: Logger = config.createLogger('emailWorker');

class EmailWorker {
  async addNotificationEmai(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { tamplate ,receiverEmail,subject} = job.data;
      await mailTranslate.sendEmail(tamplate,receiverEmail,subject);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const emailWorker: EmailWorker = new EmailWorker();
