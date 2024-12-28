import { Router } from "express";
import { resetPasswordController, sendResetPasswordEmailController } from "./controller";
import { body } from "express-validator";
import { requestValidationMiddleware } from "../../../middlewares/request-validation";

const router = Router();

router.post(
  "/resetPassword",
  body("id").isNumeric().withMessage("User id must be provide"),
  body("token").isString().withMessage("Token must be provide"),
  body("password")
    .isStrongPassword({ minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    .withMessage("Password should contain at least 1 symbol, 1 uppercase, 1 lowercase, 1 number")
    .isLength({ min: 6, max: 30 })
    .withMessage("Password should be exist with 6 - 30 characters"),
  requestValidationMiddleware,
  resetPasswordController
);

router.post(
  "/sendResetPasswordEmail",
  body("email").isEmail().withMessage("Email should be exist and in a valid structure"),
  requestValidationMiddleware,
  sendResetPasswordEmailController
);

export { router as resetPasswordRouter };
