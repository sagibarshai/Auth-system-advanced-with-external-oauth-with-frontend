import { NextFunction, Request, Response } from "express";

import { SelectUnsafeUserModel, UpdateUserIsVerifyModel } from "../models/auth";
import { BadRequestError, InternalServerError } from "../../../errors";
import { sendEmailVerification } from "../../../utils/email-verification";
import { SelectEmailVerificationModel } from "../models/email-verification";
import { config } from "../../../config";

interface EmailVerificationRequest extends Request {
  params: {
    id: string;
    token: string;
  };
}
interface ResendEmailVerificationRequest extends Request {
  body: {
    email: string;
  };
}

export const emailVerificationController = async (req: EmailVerificationRequest, res: Response, next: NextFunction) => {
  try {
    const { id, token } = req.params;
    const unsafeUser = await SelectUnsafeUserModel(Number(id));
    if (!unsafeUser) return next(BadRequestError([{ message: "User not exists", field: "id" }]));

    if (token !== unsafeUser.verificationToken) return next(BadRequestError([{ message: "Invalid verification token" }]));

    await UpdateUserIsVerifyModel(Number(id));

    res.status(301).send("Account is successfully verified");
  } catch (err) {
    next(err);
  }
};

export const resentEmailVerificationController = async (req: ResendEmailVerificationRequest, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const unsafeUser = await SelectUnsafeUserModel(email);

    if (!unsafeUser) return next(BadRequestError([{ message: "User not exist", field: "email" }]));

    const storedEmailVerification = await SelectEmailVerificationModel(unsafeUser.email!);

    if (unsafeUser.isVerified) return next(BadRequestError([{ message: "User already verified" }]));

    if (storedEmailVerification && storedEmailVerification.attempts >= config.EMAIL_VERIFICATION.MAX_ATTEMPT) {
      return next(BadRequestError([{ message: "User pass the maximum attempts of email verification ", field: "email" }]));
    }

    const emailVerification = await sendEmailVerification({ id: unsafeUser.id, to: unsafeUser.email!, token: unsafeUser.verificationToken! });

    if (!emailVerification || !emailVerification.isSent) return next(InternalServerError([{ message: `Cannot send email to ${unsafeUser.email}` }]));

    res.status(200).send(`Email verification sent successfully to ${unsafeUser.email}`);
  } catch (err) {
    next(err);
  }
};
