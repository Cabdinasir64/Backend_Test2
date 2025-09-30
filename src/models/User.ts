import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user", required: true },
    },
    {
        strict: true,
        timestamps: true
    },
);

const User = model<IUser>("Users", UserSchema);
export default User;
