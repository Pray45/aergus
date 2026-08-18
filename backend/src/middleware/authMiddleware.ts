import { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema/userSchema.js";

import { COOKIE_NAME } from "../utils/cookie.js";
import { verifyToken } from "../utils/jwt.js";

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        let token = req.cookies[COOKIE_NAME];

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.toLowerCase().startsWith("bearer ")) {
                token = authHeader.substring(7).trim();
            } else {
                token = authHeader.trim();
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const payload = verifyToken(token);

        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.userId),
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        req.user = user;

        next();

    } catch (error: any) {
        console.error("Auth Middleware Exception:", error?.message || error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};