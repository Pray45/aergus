import { Request, Response, NextFunction } from "express";
import { registerService, loginService, getCurrentUser } from "./userService.js";
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