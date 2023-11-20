import { Request, Response } from 'express';
import publicIp from 'ip';

import { IAuthDocument } from '../interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from 'src/shared/globals/helpers/error-handler';
import { uploads } from '@global/helpers/cloudinary-upload';
import HTTP_STATUS from 'http-status-codes';

import { config } from '@root/config';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { emailSchema, passwordSchema } from '../schemes/password';
import crypto from 'crypto';
import { forgotPasswordTemplate } from '@service/template/forgotPassword/forgot-Password-template';
import { emailQueue } from '@service/queues/email.queue';
import { IResetPasswordParams } from '@root/feature/user/interfaces/user.interface';
import { resetPasswordTemplate } from '@service/template/resetPassword/resetPassword';
import moment from 'moment';

export class Password {
  @joiValidation(emailSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');
    await authService.UpdatePassordtoken(`${existingUser._id!}`, randomCharacters, Date.now() * 60 * 60 * 1000);

    const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
    const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username!, resetLink);
    emailQueue.addEmailjob('forgotPasswordEmail', { template, receiverEmail: email, subject: 'Reset your password' });
    res.status(HTTP_STATUS.OK).json({ message: 'Password reset email sent.' });
  }

  @joiValidation(passwordSchema)
  public async update(req: Request, res: Response): Promise<void> {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    if (password !== confirmPassword) {
      throw new BadRequestError('Passwords do not match');
    }
    const existingUser: IAuthDocument = await authService.getAuthUserByPasswordresetToken(token);
    if (!existingUser) {
      throw new BadRequestError('Reset token has expired.');
    }

    existingUser.password = password;
    existingUser.passwordResetExpires = undefined;
    existingUser.passwordResetToken = undefined;
    await existingUser.save();

    const templateParams: IResetPasswordParams = {
      username: existingUser.username!,
      email: existingUser.email!,
      ipaddress: publicIp.address(),
      date: moment().format('DD//MM//YYYY HH:mm')
    };
    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailjob('forgotPasswordEmail', { template, receiverEmail: existingUser.email!, subject: 'Password Reset Confirmation' });
    res.status(HTTP_STATUS.OK).json({ message: 'Password successfully updated.' });
  }
}
