import { NextFunction, Request, Response } from "express";
import { NewUserPayload, InsertUserModel, SelectUserModel, DeleteUserModel } from "../models/auth";
import { BadRequestError } from "../../../errors";
import { toHash } from "../../../utils/hashes";
import { deleteTokenCookie } from "../../../utils/jwt";
import { sendEmailVerification } from "../../../utils/send-emails/email-verification";
import { ApiResponseJson } from "../../../types/api-response-json";
import { DeleteEmailVerificationModel, SelectEmailVerificationModel } from "../models/email-verification";

interface SignUpRequest extends Request {
  body: NewUserPayload;
}

export const signUpController = async (req: SignUpRequest, res: Response, next: NextFunction) => {
  try {
    deleteTokenCookie(req);

    // this controller will not accept null values because it's serve only users from internal regular signup
    const hashedPassword = toHash(req.body.password!);
    const user = await SelectUserModel(req.body.email!);

    if (user) {
      const emailVerification = await SelectEmailVerificationModel(user.email);

      if (user.isVerified) return next(BadRequestError([{ message: `User with email ${req.body.email} already exists`, field: "email" }]));

      if (emailVerification && new Date() < emailVerification?.expiredIn)
        return next(BadRequestError([{ message: `User with email ${req.body.email} already exists`, field: "email" }]));
      else {
        // delete user data
        await DeleteUserModel(user.email);

        // delete email verification data
        await DeleteEmailVerificationModel(user.email);
      }
    }

    const { safeUser } = await InsertUserModel({ ...req.body, password: hashedPassword });

    await sendEmailVerification({ id: safeUser.id, to: safeUser.email! });
    const response: ApiResponseJson = { data: safeUser };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};
