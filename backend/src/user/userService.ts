import bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { userProviders, users } from "../db/schema/userSchema.js";
import { GOOGLE_AUTH_URL, GOOGLE_TOKEN_URL, GOOGLE_USERINFO_URL } from "../config/google.js";
import { generateToken } from "../utils/jwt.js";
import axios from "axios";

const SALT_ROUNDS = 10;

interface Register {
    email: string;
    userName: string;
    password: string;
}

interface Login {
    email: string;
    password: string;
}

type GoogleProfile = {
    id: string | number;
    email?: string;
    name?: string;
    userName?: string;
};

const registerService = async (data: Register) => {

    const { email, userName, password } = data;

    // Check email
    const existingEmail = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingEmail) {
        throw new Error("Email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [user] = await db
        .insert(users)
        .values({
            email,
            userName,
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
            userName: user.userName,
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
            userName: user.userName,
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
        userName: user.userName,
    };
}

const getGoogleAuthorizationURL = () => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
    });

    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

const exchangeGoogleCode = async (code: string) => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
        code,
    });

    const response = await axios.post(GOOGLE_TOKEN_URL, params.toString(), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    if (!response.status || response.status !== 200) {
        throw new Error("Failed to exchange code for tokens.");
    }

    return response.data;
}

const getGoogleUserprofile = async (accessToken: string) => {
    const response = await axios.get(GOOGLE_USERINFO_URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.status || response.status !== 200) {
        throw new Error("Failed to fetch user profile from Google.");
    }

    return response.data;
}

const handleGoogleLogin = async (code: string) => {
    const tokenResponse = await exchangeGoogleCode(code);
    const accessToken = tokenResponse.access_token;

    if (!accessToken) {
        throw new Error("Google did not return an access token.");
    }

    const googleUserProfile = (await getGoogleUserprofile(accessToken)) as GoogleProfile;
    const providerId = String(googleUserProfile.id);

    let linkedUser = await db.query.userProviders.findFirst({
        where: and(
            eq(userProviders.provider, "google"),
            eq(userProviders.providerId, providerId)
        ),
    });

    if (linkedUser) {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, linkedUser.userId),
        });

        if (!existingUser) {
            throw new Error("Google account is linked to a missing user.");
        }

        return {
            user: {
                id: existingUser.id,
                email: existingUser.email,
                userName: existingUser.userName,
            },
            token: generateToken({ userId: existingUser.id }),
        };
    }

    if (!googleUserProfile.email) {
        throw new Error("Google account did not return an email address.");
    }

    let localUser = await db.query.users.findFirst({
        where: eq(users.email, googleUserProfile.email),
    });

    if (!localUser) {

        const [createdUser] = await db
            .insert(users)
            .values({
                email: googleUserProfile.email,
                userName: googleUserProfile.name!,
            })
            .returning();

        localUser = createdUser;
    }

    await db
        .insert(userProviders)
        .values({
            userId: localUser.id,
            provider: "google",
            providerId,
        })
        .onConflictDoNothing();

    return {
        user: {
            id: localUser.id,
            email: localUser.email,
            userName: localUser.userName,
        },
        token: generateToken({ userId: localUser.id }),
    };
};

export { registerService, loginService, getCurrentUser, getGoogleAuthorizationURL, exchangeGoogleCode, getGoogleUserprofile, handleGoogleLogin };