import { Router } from "express";
import { authenticateToken } from "../Middleware/auth";
import {
    addPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostById
} from "../controllers/posterControllers";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById); 

router.post("/", authenticateToken, addPost); 
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);

export default router;
