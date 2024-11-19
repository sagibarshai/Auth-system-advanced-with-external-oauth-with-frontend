import { Router } from "express";
import { signOutController } from "./controller";

const router = Router();

router.post("/signOut", signOutController);

export { router as SignOutRouter };
