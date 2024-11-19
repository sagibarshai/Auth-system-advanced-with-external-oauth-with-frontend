import { Router } from "express";
import { signUpRouter } from "./sign-up/route";
import { SignInRouter } from "./sign-in/route";
import { SignOutRouter } from "./sign-out/route";
import { emailRouter } from "./email-verification/route";
import { GoogleRouter } from "./google-oauth/route";

const router = Router();

router.use("/auth", signUpRouter, SignInRouter, SignOutRouter, emailRouter, GoogleRouter);
export { router as authRoutes };
