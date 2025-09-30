import { Router } from "express";
import { createUser, getUsers, updateUser, deleteUser } from "../controllers/userController";

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
    const { name, email, password, role } = req.body;

    try {
        const { user, errors } = await createUser(name, email, password, role);

        if (errors) {
            return res.status(400).json({ errors });
        }

        return res.status(201).json({ user });
    } catch (err) {
        return res.status(500).json({ error: (err as Error).message });
    }
});


router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedUser = await updateUser(id, updateData);
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await deleteUser(id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully", user: deletedUser });
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

export default router;
