import { Request, Response, NextFunction } from "express";
import { registerService, loginService, getGoogleAuthorizationURL, handleGoogleLogin, revokeRefreshTokenService, refreshTokenService } from "./userService.js";
import { setAuthCookies, clearAuthCookies, REFRESH_TOKEN_COOKIE_NAME } from "../utils/cookie.js";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const result = await registerService(req.body);

        setAuthCookies(res, result.accessToken, result.refreshToken);

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: result.user,
        });

    } catch (error) {
        next(error);
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const result = await loginService(req.body);

        setAuthCookies(res, result.accessToken, result.refreshToken);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: result.user,
        });

    } catch (error) {
        next(error);
    }
}

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const refreshTokenVal = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
        if (refreshTokenVal) {
            await revokeRefreshTokenService(refreshTokenVal);
        }

        clearAuthCookies(res);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });

    } catch (error) {
        next(error);
    }
}

export const me = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        return res.status(200).json({
            success: true,
            user: req.user,
        });

    } catch (error) {
        next(error);
    }
}

export const googleLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const googleAuthURL = await getGoogleAuthorizationURL();

        return res.redirect(googleAuthURL);

    } catch (error) {
        next(error);
    }
}

export const googleCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const { code } = req.query;

        if (!code || typeof code !== "string") {
            throw new Error("Authorization code is missing.");
        }

        const result = await handleGoogleLogin(code);

        setAuthCookies(res, result.accessToken, result.refreshToken);

        return res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/dash`);

    } catch (error) {
        next(error);
    }
}

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is missing.",
            });
        }

        const result = await refreshTokenService(token);

        setAuthCookies(res, result.accessToken, result.refreshToken);

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully.",
        });

    } catch (error) {
        next(error);
    }
}

export const upgradeTier = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { tier } = req.body;

        if (!tier || !["developer", "team", "enterprise"].includes(tier)) {
            return res.status(400).json({
                success: false,
                message: "Invalid tier specified."
            });
        }

        const { db } = await import("../db/index.js");
        const { users } = await import("../db/schema/userSchema.js");
        const { eq } = await import("drizzle-orm");

        const [updatedUser] = await db
            .update(users)
            .set({ tier, updatedAt: new Date() })
            .where(eq(users.id, userId))
            .returning();

        return res.status(200).json({
            success: true,
            message: `User tier upgraded to ${tier} successfully.`,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                userName: updatedUser.userName,
                tier: updatedUser.tier,
                avatar: updatedUser.avatar,
            },
        });

    } catch (error) {
        next(error);
    }
}