import { Router } from "express";
import { currentUserMiddleware } from "../../../middlewares/current-user.ts/index";
import { requireAuthMiddleware } from "../../../middlewares/require-auth/index";
import { currentUserController } from "./controller";
const router = Router();

router.get("/currentUser", currentUserMiddleware, requireAuthMiddleware, currentUserController);

export { router as currentUserRouter };
