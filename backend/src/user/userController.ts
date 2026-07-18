import { Request, Response, NextFunction } from "express";
import { registerService, loginService, getGoogleAuthorizationURL, handleGoogleLogin } from "./userService.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookie.js";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const result = await registerService(req.body);

        setAuthCookie(res, result.token);

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

        setAuthCookie(res, result.token);

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

        clearAuthCookie(res);

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

        setAuthCookie(res, result.token);

        return res.redirect(process.env.CLIENT_URL || "http://localhost:3000");

    } catch (error) {
        next(error);
    }
}