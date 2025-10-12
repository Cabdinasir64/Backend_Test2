import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel2, { IUserModel2 } from "../models/usermodel";
import { AuthRequest } from './../Middleware/auth'
import { hashPassword, comparePassword } from "../utils/hash";
import { validateUserInput } from "../utils/validation2";
import { generateVerificationCode, verifyCode } from "../utils/code";
import { sendVerificationEmail } from "../utils/mailer";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const errors = await validateUserInput(username, email, password);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const existingUser = await UserModel2.findOne({ email });
        if (!!existingUser) {
            return res.status(400).json({ errors: ["Email is already registered."] });
        }

        const hashedPassword = await hashPassword(password);
        const { code, expiresAt } = generateVerificationCode();

        const newUser = new UserModel2({
            username,
            email,
            password: hashedPassword,
            role: "user",
            verified: false,
            verificationCode: code,
            verificationExpires: expiresAt,
        });

        await newUser.save();

        await sendVerificationEmail(email, code);

        res.status(201).json({
            message: "User created successfully. Verification code sent to email (expires in 5 minutes).",
        });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await UserModel2.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        if (!user.verified) {
            return res.status(400).json({ error: "User not verified. Please verified your email." });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful", user: {
                username: user.username,
                email: user.email,
                role: user.role,
                redirect: user.role === "admin" ? "/admin/dashboard"
                    : user.role === "user" ? "/user/dashboard"
                        : "/"
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
};

export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ error: "Email and verification code are required" });
        }

        const user = await UserModel2.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.verified) {
            return res.status(400).json({ error: "User already verified" });
        }

        const isValid = verifyCode(code, user.verificationCode, user.verificationExpires);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid or expired verification code" });
        }

        user.verified = true;
        user.verificationCode = "";
        user.verificationExpires = null;
        await user.save();

        res.status(200).json({ message: "User verified successfully" });
    } catch (err) {
        console.error("Verification error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const resendVerificationCode = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const user = await UserModel2.findOne({ email });

        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.verified) return res.status(400).json({ error: "User already verified" });

        const { code, expiresAt } = generateVerificationCode();
        user.verificationCode = code;
        user.verificationExpires = expiresAt;
        await user.save();

        await sendVerificationEmail(email, code);

        res.status(200).json({ message: "New verification code sent to your email" });
    } catch (err) {
        console.error("Resend code error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await UserModel2.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email not registered" });
        }

        const { code, expiresAt } = generateVerificationCode();

        user.verificationCode = code;
        user.verificationExpires = expiresAt;
        await user.save();

        await sendVerificationEmail(user.email, code);

        return res.status(200).json({ message: "Verification code sent to your email", });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const verifyCodePassword = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ error: "Email and verification code are required" });
        }

        const user = await UserModel2.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isValid = verifyCode(code, user.verificationCode, user.verificationExpires);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid or expired verification code" });
        }

        user.verificationCode = "";
        user.verificationExpires = null;
        await user.save();

        res.status(200).json({ message: "User verified successfully" });
    } catch (err) {
        console.error("Verification error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ error: "Email and new password are required" });
        }

        const user = await UserModel2.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.verified) {
            return res.status(400).json({ error: "User not verified yet" });
        }

        const errors: string[] = [];

        if (!newPassword || newPassword.length < 8) {
            errors.push("Password must be at least 8 characters.");
        }
        if (!/[A-Z]/.test(newPassword)) {
            errors.push("Password must contain at least one uppercase letter.");
        }
        if (!/[a-z]/.test(newPassword)) {
            errors.push("Password must contain at least one lowercase letter.");
        }
        if (!/[0-9]/.test(newPassword)) {
            errors.push("Password must contain at least one digit.");
        }
        if (!/[!@#$%^&*]/.test(newPassword)) {
            errors.push("Password must contain at least one special character (!@#$%^&*).");
        }

        if (errors.length > 0) {
            return res.status(400).json({ error: errors.join(" ") });
        }

        user.password = await hashPassword(newPassword);

        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const search = (req.query.search as string) || "";
        const filter = (req.query.filter as string) || "";
        const page = parseInt(req.query.page as string) || 1;
        const limit = 2;
        const skip = (page - 1) * limit;

        let query: any = {};
        if (search) {
            query.username = { $regex: search, $options: "i" };
        }

        let sort: any = {};
        if (filter === "createdate_asc") {
            sort.createdAt = 1;
        } else if (filter === "createdate_desc") {
            sort.createdAt = -1;
        }

        const users = await UserModel2.find(query)
            .select("-password -verificationCode -verificationExpires")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalUsers = await UserModel2.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({
            users,
            page,
            totalPages,
            totalUsers,
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const user = req.user;
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        if (user.id === id && user.role === "admin") {
            return res.status(400).json({ error: "Admin cannot delete their own account" });
        }

        const deleted = await UserModel2.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["admin", "user"].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        const currentUser = req.user;
        if (!currentUser) return res.status(401).json({ error: "Unauthorized" });

        if (currentUser.id === id && currentUser.role === "admin") {
            return res.status(400).json({ error: "Admin cannot change their own role" });
        }

        const updated = await UserModel2.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ message: "Role updated successfully", user: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};


export const getMe = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user: IUserModel2 | null = await UserModel2.findById(req.user.id).select("-password -verificationCode -verificationExpires");

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ user });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Server error" });
    }
};