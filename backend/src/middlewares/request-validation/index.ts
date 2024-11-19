import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadRequestError, CustomErrorMessage } from "../../errors";

export const requestValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) next();
  else {
    const formattedErrors: CustomErrorMessage = errors.array().map((e) => ({ message: e.msg, field: e.type === "field" ? e.path : undefined }));
    const badRequestError = BadRequestError(formattedErrors);
    next(badRequestError);
  }
};
