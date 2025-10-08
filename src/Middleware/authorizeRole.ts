import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export const authorizeRole = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ error: "Access denied: insufficient role" });
        }

        next();
    };
};

