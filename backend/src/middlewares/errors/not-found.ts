import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../errors";

export const notfoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next(NotFoundError());
};
