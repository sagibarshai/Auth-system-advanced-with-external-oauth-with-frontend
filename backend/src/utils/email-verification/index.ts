import nodemailer from "nodemailer";

import { config } from "../../config";
import { ReturnedEmailVerification, UpsertEmailVerificationModel } from "../../features/auth/models/email-verification";

interface VerifyEmailProperties {
  to: string;
  token: string;
  id: number;
  subject?: string;
  text?: string;
}
export const sendEmailVerification = async ({
  id,
  to,
  token,
  subject = "Account verification",
  text = "Verify your account here:",
}: VerifyEmailProperties): Promise<ReturnedEmailVerification | undefined> => {
  const mailOptions = {
    from: config.MAIL.FROM,
    to: to,
    subject: subject,
    html: ` <a href=${config.BASE_URL}:${config.PORT}/api/auth/emailVerification/${id}/${encodeURIComponent(token)}>
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
    return await UpsertEmailVerificationModel({ email: to, isSent: true, userId: id });
  } catch (err) {
    return await UpsertEmailVerificationModel({ email: to, isSent: false, userId: id });
  }
};
