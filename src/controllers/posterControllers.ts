import { Request, Response } from "express";
import PostModel, { IPost } from "../models/PostModel";
import { AuthRequest } from "../Middleware/auth";

export const addPost = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, image } = req.body;

        if (!title || !content || !image) {
            return res.status(400).json({ error: "Title, content, and image are required" });
        }

        const post = new PostModel({
            user: req.user!.id,
            title,
            content,
            image,
        });

        await post.save();

        res.status(201).json({ message: "Post created successfully", post });
    } catch (err) {
        console.error("Add post error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, image } = req.body;

        const post = await PostModel.findById(id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        if (post.user.toString() !== req.user!.id && req.user!.role !== "user") {
            return res.status(403).json({ error: "Unauthorized" });
        }

        if (title) post.title = title;
        if (content) post.content = content;
        if (image) post.image = image;

        await post.save();

        res.status(200).json({ message: "Post updated successfully", post });
    } catch (err) {
        console.error("Update post error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const post = await PostModel.findById(id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        if (post.user.toString() !== req.user!.id && req.user!.role !== "user") {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await PostModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Delete post error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await PostModel.find()
            .populate("users2", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json({ posts });
    } catch (err) {
        console.error("Get posts error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const post = await PostModel.findById(id).populate("user", "username email");
        if (!post) return res.status(404).json({ error: "Post not found" });

        res.status(200).json({ post });
    } catch (err) {
        console.error("Get single post error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
