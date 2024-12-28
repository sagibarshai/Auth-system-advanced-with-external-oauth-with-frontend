import nodemailer from "nodemailer";

import { config } from "../../config";
import { addMinutesFromNow } from "../dates";
import { ReturnedResetPassword, UpsertResetPasswordModel } from "../../features/auth/models/reset-password";

interface ResetPasswordProperties {
  to: string;
  id: number;
  subject?: string;
  text?: string;
}
export const sendResetPasswordEmail = async ({
  id,
  to,
  subject = "Reset Password",
  text = `Click here to change your password, this link is valid for the next ${config.RESET_PASSWORD.EXPIRED_IN} minutes`,
}: ResetPasswordProperties): Promise<ReturnedResetPassword | undefined> => {
  const token = crypto.randomUUID();
  const tokenExpiredIn = addMinutesFromNow(config.RESET_PASSWORD.EXPIRED_IN);
  const mailOptions = {
    from: config.MAIL.FROM,
    to: to,
    subject: subject,
    html: ` <a href=${config.RESET_PASSWORD.VERIFICATION_URL}/${id}/${encodeURIComponent(token)}>
    ${text}
    </a> `,
  };

  const transporter = nodemailer.createTransport({
    service: config.MAIL.SERVICE,
    host: config.MAIL.HOST,
    port: config.MAIL.PORT,
    secure: config.MAIL.SECURE,
    auth: {
      user: config.MAIL.AUTH.USER,
      pass: config.MAIL.AUTH.PASS,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
    return await UpsertResetPasswordModel({ email: to, isSent: true, userId: id, verificationToken: token, expiredIn: tokenExpiredIn });
  } catch (err) {
    return await UpsertResetPasswordModel({ email: to, isSent: false, userId: id, verificationToken: token, expiredIn: tokenExpiredIn });
  }
};
