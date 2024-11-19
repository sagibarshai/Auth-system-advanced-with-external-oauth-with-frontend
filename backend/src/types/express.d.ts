import { Request } from "express";
import { SafeUser } from "../features/auth/models/auth";

declare global {
  namespace Express {
    interface Request {
      currentUser?: SafeUser;
    }
  }
}
