import User, { IUser } from "../models/User";
import { hashPassword } from "./hash";

type ValidationResult = {
    valid: boolean;
    errors: string[];
};


export const isEmailTaken = async (email: string): Promise<boolean> => {
    const existing = await User.findOne({ email }).lean().exec();
    return existing ? true : false;
};

export const validatePassword = (password: string): ValidationResult => {
    const errors: string[] = [];

    if (!password || password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter (a-z).");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter (A-Z).");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number (0-9).");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push("Password must contain at least one symbol (e.g., !@#$%).");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

export const ensureUsernameEmailPasswordOK = async (username: string, email: string, password: string): Promise<ValidationResult> => {
    const result: ValidationResult = { valid: true, errors: [] };

    const usernameCheck = validateUsername(username);
    if (!usernameCheck.valid) {
        result.valid = false;
        result.errors.push(...usernameCheck.errors);
    }

    const taken = await isEmailTaken(email);
    if (taken) {
        result.valid = false;
        result.errors.push("This email is already in use. Please use a different email.");
    }

    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
        result.valid = false;
        result.errors.push(...pwCheck.errors);
    }

    return result;
};


export const validateUsername = (username: string): ValidationResult => {
    const errors: string[] = [];

    if (!username) {
        errors.push("Username is required.");
    } else if (username.length < 3) {
        errors.push("Username must be at least 3 characters long.");
    }
    if (username.length > 30) {
        errors.push("Username cannot be longer than 30 characters.");
    }

    const firstChar = username.charAt(0);
    if (/[\d\s#_]/.test(firstChar)) {
        errors.push("Username cannot start with a number, space, '#' or '_'.");
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.push("Username can only contain letters, numbers, '-' and '_'.");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};
