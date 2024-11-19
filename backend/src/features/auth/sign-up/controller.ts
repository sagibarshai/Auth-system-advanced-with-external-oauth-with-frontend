import { NextFunction, Request, Response } from "express";
import { NewUserPayload, InsertUserModel, SelectUserModel } from "../models/auth";
import { BadRequestError } from "../../../errors";
import { toHash } from "../../../utils/hashes";
import { deleteTokenCookie } from "../../../utils/jwt";
import { sendEmailVerification } from "../../../utils/email-verification";

interface SignUpRequest extends Request {
  body: NewUserPayload;
}

export const signUpController = async (req: SignUpRequest, res: Response, next: NextFunction) => {
  // this controller will not accept null values because it's serve only users from internal regular signup
  try {
    deleteTokenCookie(req);

    const hashedPassword = toHash(req.body.password!);
    const isUserExists = await SelectUserModel(req.body.email!);
    if (isUserExists) return next(BadRequestError([{ message: `User with email ${req.body.email} already exists`, field: "email" }]));

    const { safeUser, verificationToken } = await InsertUserModel({ ...req.body, password: hashedPassword });

    await sendEmailVerification({ id: safeUser.id, to: safeUser.email!, token: verificationToken! });
    res.status(201).send(safeUser);
  } catch (err) {
    next(err);
  }
};
