import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { SafeUser } from "../models/auth";
import { googleStrategy } from "./strategy";
import { config } from "../../../config";
import { ErrorPayload, ErrorTypes, InternalServerError } from "../../../errors";

const router = Router();

googleStrategy;

const formatError = (err: ErrorPayload): string => {
  if (err && err.type in ErrorTypes) {
    return encodeURIComponent(JSON.stringify(err.errors));
  }

  const fallbackError = InternalServerError([{ message: "Authentication failed" }]);
  return encodeURIComponent(JSON.stringify(fallbackError.errors));
};

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get("/google/callback", async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", {}, (err: ErrorPayload, userData: SafeUser) => {
    if (err) {
      const errorsMsg = formatError(err);
      return res.status(err.statusCode || 400).redirect(`${config.GOOGLE_OAUTH.GOOGLE_FAILURE_REDIRECT}?errors=${errorsMsg}`);
    }
    res.status(200).redirect(config.GOOGLE_OAUTH.GOOGLE_SUCCESS_REDIRECT);
  })(req, res, next);
});

export { router as GoogleRouter };
