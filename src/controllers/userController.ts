import bcrypt from 'bcryptjs'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import dotenv from "dotenv";
import User, { IUser } from "../models/User";
import { hashPassword } from '../utils/hash'
import { ensureUsernameEmailPasswordOK } from "../utils/validation";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const createUser = async (name: string, email: string, password: string, role: "admin" | "user" = "user"): Promise<{ user?: IUser; errors?: string[] }> => {

    const validation = await ensureUsernameEmailPasswordOK(name, email, password);
    if (!validation.valid) {
        return { errors: validation.errors };
    }

    const hashpass = await hashPassword(password);

    const user = new User({ name, email, password: hashpass, role });
    await user.save();

    return { user };
};

export const getUsers = async (): Promise<IUser[]> => {
    return User.find();
};

export const updateUser = async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    return updatedUser;
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
};

export const loginUser = async (email: string, password: string): Promise<{ user?: Omit<IUser, 'password'>; token?: string; error?: string }> => {
    try {
        const user = await User.findOne({ email }).lean();
        if (!user) return { error: "Invalid email or password" };

        const match = await bcrypt.compare(password, user.password);
        if (!match) return { error: "Invalid email or password" };

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '14d' }
        );

        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };

    } catch (err) {
        return { error: "Server error" };
    }
};
