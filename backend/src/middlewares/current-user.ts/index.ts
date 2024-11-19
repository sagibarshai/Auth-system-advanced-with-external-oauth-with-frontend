import { NextFunction, Request, Response } from "express";
import { deleteTokenCookie, refreshTokenAndSetCookie, verifyToken } from "../../utils/jwt";

export const currentUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.session?.token;

    if (!token) {
      req.currentUser = undefined;
      deleteTokenCookie(req);
    } else {
      const safeUser = verifyToken(token);
      if (safeUser) {
        refreshTokenAndSetCookie(token, req); // Generate and set a new token in the session to extend the user's session (similar to a refresh token)
        req.currentUser = safeUser;
      }
    }
    next();
  } catch (err) {
    deleteTokenCookie(req);

    next(err);
  }
};
