import { NextFunction, Request, Response } from "express";
import { ErrorPayload, ErrorTypes, InternalServerError } from "../../errors";

export const errorMiddleware = (error: ErrorPayload, req: Request, res: Response, next: NextFunction) => {
  if (error?.type in ErrorTypes) {
    res.status(error.statusCode).send(error.errors);
  } else {
    console.log("Unknown Error Occurred  --------------------------  ", error);
    const err = InternalServerError();
    res.status(err.statusCode).send(err.errors);
  }
};
