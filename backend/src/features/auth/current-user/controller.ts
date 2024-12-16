import { NextFunction, Request, Response } from "express";
import { ApiResponseJson } from "../../../types/api-response-json";

export const currentUserController = (req: Request, res: Response, next: NextFunction) => {
  const response: ApiResponseJson = { data: req.currentUser };

  res.status(200).json(response);
};
