import { Router } from "express";
import { createUser, loginUser, verifyUser } from "../controllers/usercontrollers2";

const router = Router();

router.post("/register", createUser);

router.post("/login", loginUser);

router.post("/verify", verifyUser);

export default router;
