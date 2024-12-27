import { NextFunction, Request, Response } from "express";

import { SelectUnsafeUserModel, UpdateUserIsVerifyModel } from "../models/auth";
import { BadRequestError, InternalServerError } from "../../../errors";
import { sendEmailVerification } from "../../../utils/email-verification";
import { SelectEmailVerificationModel } from "../models/email-verification";
import { config } from "../../../config";
import { ApiResponseJson } from "../../../types/api-response-json";

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

    const emailVerification = await SelectEmailVerificationModel(unsafeUser.email);

    if (!emailVerification) return next(InternalServerError());

    if (token !== emailVerification.verificationToken) return next(BadRequestError([{ message: "Invalid verification token" }]));

    if (emailVerification.expiredIn < new Date() && !unsafeUser.isVerified) return next(BadRequestError([{ message: "Verification token expired" }]));
    await UpdateUserIsVerifyModel(Number(id));

    const response: ApiResponseJson = {
      message: unsafeUser.isVerified ? "User already verified" : "Account is successfully verified",
      data: { email: unsafeUser.email },
    };

    res.status(301).json(response);
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

    if (storedEmailVerification && storedEmailVerification.attempts > config.EMAIL_VERIFICATION.MAX_ATTEMPT) {
      return next(BadRequestError([{ message: "User pass the maximum attempts of email verification ", field: "email" }]));
    }

    const emailVerification = await sendEmailVerification({
      id: unsafeUser.id,
      to: unsafeUser.email!,
    });

    if (!emailVerification || !emailVerification.isSent) return next(InternalServerError([{ message: `Cannot send email to ${unsafeUser.email}` }]));

    const response: ApiResponseJson = {
      message: `Email verification successfully sent to ${unsafeUser.email}`,
      data: { remainAttempts: config.EMAIL_VERIFICATION.MAX_ATTEMPT - storedEmailVerification!.attempts },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
