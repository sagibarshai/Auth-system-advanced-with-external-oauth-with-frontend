import { Router } from "express";
import { resetPasswordController } from "./controller";
import { body } from "express-validator";
import { requestValidationMiddleware } from "../../../middlewares/request-validation";

const router = Router();

router.post(
  "/reset-password",
  body("email").isEmail().withMessage("Email should be exist and in a valid structure"),
  requestValidationMiddleware,
  resetPasswordController
);

export { router as resetPasswordRouter };
