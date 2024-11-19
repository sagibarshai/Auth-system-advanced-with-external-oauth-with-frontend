import { NextFunction, Request, Response } from "express";
import { SelectUnsafeUserModel, UpdateLoginModel } from "../models/auth";
import { BadRequestError, ForbiddenError } from "../../../errors";
import { compereHash } from "../../../utils/hashes";
import { createTokenSetCookie, deleteTokenCookie } from "../../../utils/jwt";

interface SignUpRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const signInController = async (req: SignUpRequest, res: Response, next: NextFunction) => {
  try {
    deleteTokenCookie(req);

    const storedUser = await SelectUnsafeUserModel(req.body.email);
    if (!storedUser) return next(BadRequestError([{ message: "Wrong Credentials" }]));
    if (!storedUser.isVerified) return next(ForbiddenError([{ message: "Email not verify, please check user email" }]));
    // password shouldn't be null here because this route handle only regular email and password register
    if (!storedUser.password)
      // password is null only when the user is signup with external provider
      return next(
        BadRequestError([
          {
            message: `User authenticated via ${storedUser.provider} cannot sign in with a password. Please use the appropriate ${storedUser.provider} login route.`,
          },
        ])
      );

    const isPasswordsMatch = compereHash(storedUser.password, req.body.password);

    if (!isPasswordsMatch) return next(BadRequestError([{ message: "Wrong Credentials" }]));

    const safeUser = await UpdateLoginModel(req.body.email);

    // attach token as cookie to client
    createTokenSetCookie(safeUser, req);

    res.status(200).send(safeUser);
  } catch (err) {
    next(err);
  }
};
