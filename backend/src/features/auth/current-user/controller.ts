import { NextFunction, Request, Response } from "express";

export const currentUserController = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send(req.currentUser);
};
