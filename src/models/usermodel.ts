import { Schema, model, Document } from "mongoose";

export interface IUserModel2 extends Document {
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
    verified: boolean;
    verificationCode: string;
}

const UserSchema = new Schema<IUserModel2>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
            maxlength: 255,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            required: [true, "Role is required"],
            default: "user",
        },
        verified: {
            type: Boolean,
            required: true,
            default: false,
        },
        verificationCode: {
            type: String,
            required: [true, "Verification code is required"],
            index: true,
        },
    },
    {
        timestamps: true,
        strict: true
    }
);

UserSchema.index({ username: 1 })
UserSchema.index({ username: "text" });
UserSchema.index({ role: 1 })


const UserModel2 = model<IUserModel2>("User2", UserSchema);

export default UserModel2;
