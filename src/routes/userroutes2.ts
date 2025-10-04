import { Router } from "express";
import { createUser, loginUser, verifyUser, resendVerificationCode } from "../controllers/usercontrollers2";

const router = Router();

router.post("/register", createUser);

router.post("/login", loginUser);

router.post("/verify", verifyUser);

router.post("/resend-code", resendVerificationCode);

export default router;
