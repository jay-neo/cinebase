import express from "express";

import { authService } from "../service/auth-service/auth.service";

const router = express.Router();

router.delete("/logout", authService.logout);

router.get("/user", authService.authenticate, authService.getUser);

router.get("/:provider", authService.oAuthProvider);
router.get("/:provider/callback", authService.oAuthProviderCallback);

export default router;
