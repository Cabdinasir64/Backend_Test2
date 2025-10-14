import { Router } from "express";
import { authenticateToken } from "../Middleware/auth";
import { upload } from "../utils/cloudinary";
import { addPost, updatePost, deletePost, getAllPosts, getPostById, } from "../controllers/posterControllers";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);

router.post("/", authenticateToken, upload.single("image"), addPost);
router.put("/:id", authenticateToken, upload.single("image"), updatePost);
router.delete("/:id", authenticateToken, deletePost);

export default router;
