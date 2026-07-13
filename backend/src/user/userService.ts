import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema/userSchema.js";
import { generateToken } from "../utils/jwt.js";;

const SALT_ROUNDS = 10;

interface Register {
    email: string;
    username: string;
    password: string;
}

interface Login {
    email: string;
    password: string;
}

const registerService = async (data: Register) => {

    const { email, username, password } = data;

    // Check email
    const existingEmail = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingEmail) {
        throw new Error("Email already exists.");
    }

    // Check username
    const existingUsername = await db.query.users.findFirst({
        where: eq(users.username, username),
    });

    if (existingUsername) {
        throw new Error("Username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [user] = await db
        .insert(users)
        .values({
            email,
            username,
            passwordHash: hashedPassword,
        })
        .returning();

    const token = generateToken({
        userId: user.id,
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
        },
        token,
    };
}

const loginService = async (data: Login) => {

    const { email, password } = data;

    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!user) {
        throw new Error("Invalid credentials.");
    }

    if (!user.passwordHash) {
        throw new Error(
            "This account uses social login."
        );
    }

    const validPassword = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!validPassword) {
        throw new Error("Invalid credentials.");
    }

    const token = generateToken({
        userId: user.id,
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
        },
        token,
    };
}

const getCurrentUser = async (userId: number) => {

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) {
        throw new Error("User not found.");
    }

    return {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
    };
}

export { registerService, loginService, getCurrentUser };