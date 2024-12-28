import { NextFunction, Request, Response } from "express";
import { SelectUserModel } from "../models/auth";
import { BadRequestError, InternalServerError } from "../../../errors";
import { SelectResetPasswordModel } from "../models/reset-password";
import { config } from "../../../config";
import { sendResetPasswordEmail } from "../../../utils/send-emails/reset-password";
import { ApiResponseJson } from "../../../types/api-response-json";

interface ResetPasswordRequest extends Request {
  body: {
    email: string;
  };
}

export const resetPasswordController = async (req: ResetPasswordRequest, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const user = await SelectUserModel(email);
    if (!user) return next(BadRequestError([{ message: "User not exists", field: "id" }]));

    if (!user.isVerified) return next(BadRequestError([{ message: "User not verified" }]));

    const storedResetPassword = await SelectResetPasswordModel(user.email);

    if (storedResetPassword && storedResetPassword.attempts > config.RESET_PASSWORD.MAX_ATTEMPTS) {
      return next(BadRequestError([{ message: "User pass the maximum attempts of reset password ", field: "email" }]));
    }

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
