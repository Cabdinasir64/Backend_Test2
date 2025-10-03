import UserModel2 from "../models/usermodel";

export const validateUserInput = async (username: string, email: string, password: string): Promise<string[]> => {
    const errors: string[] = [];

    if (!username || username.trim().length < 3 || username.trim().length > 20) {
        errors.push("Username must be between 3 and 20 characters.");
    }
    if (/^[0-9]/.test(username)) {
        errors.push("Username cannot start with a number.");
    }
    if (/^[^a-zA-Z]/.test(username)) {
        errors.push("Username cannot start with special characters.");
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push("Username can only contain letters, numbers, and underscores.");
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Invalid email format.");
    } else {
        const existingEmail = await UserModel2.findOne({ email });
        if (existingEmail) {
            errors.push("Email is already in use.");
        }
    }

    if (!password || password.length < 8) {
        errors.push("Password must be at least 8 characters.");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one digit.");
    }
    if (!/[!@#$%^&*]/.test(password)) {
        errors.push("Password must contain at least one special character (!@#$%^&*).");
    }
    return errors;
};
