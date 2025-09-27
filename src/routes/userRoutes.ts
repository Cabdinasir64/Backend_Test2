import { Router } from "express";
import { createUser, getUsers } from "../controllers/userController";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.post("/", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await createUser(name, email, password);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

export default router;
