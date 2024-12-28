import { NextFunction, Request, Response } from "express";

import { SelectUserModel, UpdateUserIsVerifyModel } from "../models/auth";
import { BadRequestError, InternalServerError } from "../../../errors";
import { sendEmailVerification } from "../../../utils/send-emails/email-verification";
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
    const user = await SelectUserModel(Number(id));
    if (!user) return next(BadRequestError([{ message: "User not exists", field: "id" }]));

    const emailVerification = await SelectEmailVerificationModel(user.email);

    if (!emailVerification) return next(InternalServerError());

    if (token !== emailVerification.verificationToken) return next(BadRequestError([{ message: "Invalid verification token" }]));

    if (emailVerification.expiredIn < new Date() && !user.isVerified) return next(BadRequestError([{ message: "Verification token expired" }]));
    await UpdateUserIsVerifyModel(Number(id));

    const response: ApiResponseJson = {
      message: user.isVerified ? "User already verified" : "Account is successfully verified",
      data: { email: user.email },
    };

    res.status(301).json(response);
  } catch (err) {
    next(err);
  }
};

export const resentEmailVerificationController = async (req: ResendEmailVerificationRequest, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await SelectUserModel(email);

    if (!user) return next(BadRequestError([{ message: "User not exist", field: "email" }]));

    const storedEmailVerification = await SelectEmailVerificationModel(user.email!);

    if (user.isVerified) return next(BadRequestError([{ message: "User already verified" }]));

    if (storedEmailVerification && storedEmailVerification.attempts > config.EMAIL_VERIFICATION.MAX_ATTEMPTS) {
      return next(BadRequestError([{ message: "User pass the maximum attempts of email verification ", field: "email" }]));
    }

    const emailVerification = await sendEmailVerification({
      id: user.id,
      to: user.email!,
    });

    if (!emailVerification || !emailVerification.isSent) return next(InternalServerError([{ message: `Cannot send email to ${user.email}` }]));

    const response: ApiResponseJson = {
      message: `Email verification successfully sent to ${user.email}`,
      data: { remainAttempts: config.EMAIL_VERIFICATION.MAX_ATTEMPTS - storedEmailVerification!.attempts, email: user.email },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
