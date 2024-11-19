import { Router } from "express";
import { emailVerificationController, resentEmailVerificationController } from "./controller";
import { body } from "express-validator";
import { requestValidationMiddleware } from "../../../middlewares/request-validation";

const router = Router();

router.get("/emailVerification/:id/:token", emailVerificationController);

router.post(
  "/emailVerification/resend",
  body("email").isEmail().withMessage("Email should be exist and in a valid structure"),
  requestValidationMiddleware,
  resentEmailVerificationController
);

export { router as emailRouter };
