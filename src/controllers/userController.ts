import User, { IUser } from "../models/User";
import { hashPassword } from '../utils/hash'
import { ensureUsernameEmailPasswordOK } from "../utils/validation";

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