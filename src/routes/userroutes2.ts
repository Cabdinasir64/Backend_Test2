import { Router } from "express";
import { createUser, loginUser, verifyUser, resendVerificationCode, forgotPassword, verifyCodePassword, resetPassword } from "../controllers/usercontrollers2";

const router = Router();

router.post("/register", createUser);

router.post("/login", loginUser);

router.post("/verify", verifyUser);

router.post("/resend-code", resendVerificationCode);

router.post("/forgot-password", forgotPassword);

router.post("/verify-code-password", verifyCodePassword);

router.post("/reset-password", resetPassword)


export default router;
