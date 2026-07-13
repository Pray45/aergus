import { Router } from "express";
import {
    register,
    login,
    // googleLogin, 
    // googleCallback, 
    // githubLogin, 
    // githubCallback, 
    logout,
    me
} from "./userController.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
// authRouter.get("/google", googleLogin);
// authRouter.get("/google/callback", googleCallback);
// authRouter.get("/github", githubLogin);
// authRouter.get("/github/callback", githubCallback);
authRouter.post("/logout", logout);
authRouter.get("/me", protect, me);

export default authRouter;