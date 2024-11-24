import { Router } from "express";
import { signUpController } from "./controller";
import { body } from "express-validator";
import { requestValidationMiddleware } from "../../../middlewares/request-validation";

const router = Router();

router.post(
  "/signUp",
  body("firstName").optional().isLength({ min: 2, max: 40 }).withMessage("First name should be with 2 - 40 characters"),
  body("lastName").optional().isLength({ min: 2, max: 40 }).withMessage("Last name should be with 2 - 40 characters"),
  body("phoneNumber").optional().isMobilePhone("he-IL").withMessage("Phone number should be from IL and valid"),
  body("email").isEmail().withMessage("Email should be exist and in a valid structure"),
  body("password")
    .isStrongPassword({ minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    .withMessage("Password should contain at least 1 symbol, 1 uppercase, 1 lowercase, 1 number")
    .isLength({ min: 6, max: 30 })
    .withMessage("Password should be exist with 6 - 30 characters"),
  requestValidationMiddleware,
  signUpController
);

export { router as signUpRouter };
