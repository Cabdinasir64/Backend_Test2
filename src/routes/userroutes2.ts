import { Router } from "express";
import { authenticateToken } from './../Middleware/auth'
import { createUser, loginUser, verifyUser, resendVerificationCode, forgotPassword, verifyCodePassword, resetPassword, getAllUsers, getMe } from "../controllers/usercontrollers2";

const router = Router();

router.post("/register", createUser);

router.post("/login", loginUser);

router.post("/verify", verifyUser);

router.post("/resend-code", resendVerificationCode);

router.post("/forgot-password", forgotPassword);

router.post("/verify-code-password", verifyCodePassword);

router.post("/reset-password", resetPassword)

router.get("/users", authenticateToken, getAllUsers);

router.get("/me", authenticateToken, getMe);



export default router;
