import User, { IUser } from "../models/User";

export const createUser = async (name: string, email: string, password: string): Promise<IUser> => {
    const user = new User({ name, email, password });
    await user.save();
    return user;
};

export const getUsers = async (): Promise<IUser[]> => {
    return User.find();
};
