import { NextFunction, Request, Response } from "express";
import { deleteTokenCookie } from "../../utils/jwt";
import { UnauthorizedError } from "../../errors";

export const requireAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req?.currentUser) next();
  else {
    deleteTokenCookie(req);
    const error = UnauthorizedError();
    next(error);
  }
};
