import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Logger from 'bunyan';
import sendgride from '@sendgrid/mail';
import { config } from '@root/config';
import { BadRequestError } from '@global/helpers/error-handler';

interface ImailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const log: Logger = config.createLogger('mailoptions');
sendgride.setApiKey(config.SENDGRID_API_KEY!);

class MailTranslate {
  public async sendEmail(receiverEmail: string, subject: string, body: string): Promise<void> {
    if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
      this.developmentemailSender(receiverEmail, subject, body);
    } else {
      this.ProductionemailSender(receiverEmail, subject, body);
    }
  }

  private async developmentemailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
    const transporter:Mail = nodemailer.createTransport({
      host: 'smtp.forwardemail.email',
      port: 465,
      secure: false,
      auth: {
        user: config.SENDER_EMAL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });

    const Mailoption: ImailOptions = {
      from: `manish<${config.SENDER_EMAL}>`,
      to: receiverEmail,
      subject,
      html: body
    };

    try {
      await transporter.sendMail(Mailoption);
      log.info('Development Email send Successfully');
    } catch (error) {
      log.error('Error in sending mail', error);
      throw new BadRequestError('Eroor sending mail');
    }
  }

  private async ProductionemailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
    const Mailoption: ImailOptions = {
      from: `manish<${config.SENDER_EMAL}>`,
      to: receiverEmail,
      subject,
      html: body
    };

    try {
      await sendgride.send(Mailoption);
      log.info('production Email send Successfully');
    } catch (error) {
      log.error('Error in sending mail', error);
      throw new BadRequestError('Eroor sending mail');
    }
  }
}
export const mailTranslate: MailTranslate = new MailTranslate();
