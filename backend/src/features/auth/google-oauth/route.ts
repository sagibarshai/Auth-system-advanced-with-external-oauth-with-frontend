import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { SafeUser } from "../models/auth";
import { googleStrategy } from "./strategy";

const router = Router();

googleStrategy;

router.get("/google", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", { scope: ["email", "profile"] })(req, res, next);
});

router.get("/google/callback", async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", {}, (err: unknown, userData: SafeUser) => {
    if (err) return next(err);

    res.send(userData);
  })(req, res, next);
});

export { router as GoogleRouter };
