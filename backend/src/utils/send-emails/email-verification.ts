import nodemailer from "nodemailer";

import { config } from "../../config";
import { ReturnedEmailVerification, UpsertEmailVerificationModel } from "../../features/auth/models/email-verification";
import { addMinutesFromNow } from "../dates";

interface VerifyEmailProperties {
  to: string;
  id: number;
  subject?: string;
  text?: string;
}
export const sendEmailVerification = async ({
  id,
  to,
  subject = "Account Verification",
  text = `Click here to verify your account, this link is valid for the next ${config.EMAIL_VERIFICATION.EXPIRED_IN} minutes`,
}: VerifyEmailProperties): Promise<ReturnedEmailVerification | undefined> => {
  const token = crypto.randomUUID();
  const tokenExpiredIn = addMinutesFromNow(config.EMAIL_VERIFICATION.EXPIRED_IN);
  const mailOptions = {
    from: config.MAIL.FROM,
    to: to,
    subject: subject,
    html: ` <a href=${config.EMAIL_VERIFICATION.VERIFICATION_URL}/${id}/${encodeURIComponent(token)}>
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
    return await UpsertEmailVerificationModel({ email: to, isSent: true, userId: id, verificationToken: token, expiredIn: tokenExpiredIn });
  } catch (err) {
    return await UpsertEmailVerificationModel({ email: to, isSent: false, userId: id, verificationToken: token, expiredIn: tokenExpiredIn });
  }
};
