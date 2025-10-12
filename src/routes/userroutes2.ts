import { Router } from "express";
import { authenticateToken } from './../Middleware/auth'
import { authorizeRole } from './../Middleware/authorizeRole'
import { createUser, loginUser, verifyUser, resendVerificationCode, forgotPassword, verifyCodePassword, resetPassword, getAllUsers, getMe, logoutUser, deleteUser, updateUserRole, changePassword, changeUsername } from "../controllers/usercontrollers2";

const router = Router();

router.post("/register", createUser);

router.post("/login", loginUser);

router.post("/verify", verifyUser);

router.post("/resend-code", resendVerificationCode);

router.post("/forgot-password", forgotPassword);

router.post("/verify-code-password", verifyCodePassword);

router.post("/reset-password", resetPassword)

router.get("/users", authenticateToken, authorizeRole("admin"), getAllUsers);

router.delete("/users/:id", authenticateToken, authorizeRole("admin"), deleteUser);

router.put("/users/:id/role", authenticateToken, authorizeRole("admin"), updateUserRole);

router.get("/me", authenticateToken, getMe);

router.put("/change-password", authenticateToken, changePassword);

router.put("/change-username", authenticateToken, changeUsername);

router.post("/logout", logoutUser);

export default router;
