import User, { IUser } from "../models/User";

export const createUser = async (name: string, email: string, password: string): Promise<IUser> => {
    const user = new User({ name, email, password });
    await user.save();
    return user;
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