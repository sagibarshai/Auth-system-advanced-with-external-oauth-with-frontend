import { Request, Response } from "express";
import { deleteTokenCookie } from "../../../utils/jwt";

export const signOutController = (req: Request, res: Response) => {
  deleteTokenCookie(req);
  res.status(301).send();
};
