import { NextFunction, Request, Response } from "express";
import { SelectUserModel, UpdateUserPassword } from "../models/auth";
import { BadRequestError, InternalServerError } from "../../../errors";
import { SelectResetPasswordModel } from "../models/reset-password";
import { config } from "../../../config";
import { sendResetPasswordEmail } from "../../../utils/send-emails/reset-password";
import { ApiResponseJson } from "../../../types/api-response-json";
import { toHash } from "../../../utils/hashes";

interface SendResetPasswordEmailRequest extends Request {
  body: {
    email: string;
  };
}
interface ResetPasswordRequest extends Request {
  body: {
    id: string;
    token: string;
    password: string;
  };
}

export const resetPasswordController = async (req: ResetPasswordRequest, res: Response, next: NextFunction) => {
  try {
    const { id, token, password } = req.body;
    const user = await SelectUserModel(Number(id));
    if (!user) return next(BadRequestError([{ message: "User not exists", field: "id" }]));
    if (!user.isVerified) return next(BadRequestError([{ message: "User not verified" }]));

    const resetPassword = await SelectResetPasswordModel(user.email);

    if (!resetPassword) return next(BadRequestError([{ message: "Request is not valid" }]));

    if (resetPassword.expiredIn < new Date()) return next(BadRequestError([{ message: "Verification token expired" }]));

    if (token !== resetPassword.verificationToken) return next(BadRequestError([{ message: "Invalid verification token" }]));
    else {
      const updatedUser = await UpdateUserPassword(user.id, toHash(password));
      if (!updatedUser) return next(InternalServerError([{ message: "Cannot change password" }]));

      const response: ApiResponseJson = {
        message: "Password successfully updated",
        data: { email: user.email },
      };

      res.status(301).json(response);
    }
  } catch (err) {
    next(err);
  }
};

export const sendResetPasswordEmailController = async (req: SendResetPasswordEmailRequest, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const user = await SelectUserModel(email);
    if (!user) return next(BadRequestError([{ message: "User not exists", field: "id" }]));

    if (!user.isVerified) return next(BadRequestError([{ message: "User not verified" }]));

    if (user.provider !== "app")
      return next(BadRequestError([{ message: `User is register via ${user.provider} and should signin from ${user.provider}` }]));

    const storedResetPassword = await SelectResetPasswordModel(user.email);

    if (storedResetPassword && storedResetPassword.attempts >= config.RESET_PASSWORD.MAX_ATTEMPTS) {
      return next(BadRequestError([{ message: "User pass the maximum attempts of reset password ", field: "email" }]));
    }
    console.log("storedResetPassword ", storedResetPassword);

    const resetPassword = await sendResetPasswordEmail({ id: user.id, to: user.email });
    if (!resetPassword || !resetPassword.isSent) return next(InternalServerError([{ message: `Cannot send email to ${user.email}` }]));

    const response: ApiResponseJson = {
      message: `Email to reset the password successfully sent to ${user.email}`,
      data: { remainAttempts: config.RESET_PASSWORD.MAX_ATTEMPTS - resetPassword!.attempts },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
