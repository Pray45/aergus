import bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { userProviders, users, refreshTokens } from "../db/schema/userSchema.js";
import { GOOGLE_AUTH_URL, GOOGLE_TOKEN_URL, GOOGLE_USERINFO_URL } from "../config/google.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt.js";
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
    sub?: string;
    id?: string;
    email?: string;
    name?: string;
    userName?: string;
    picture?: string;
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

    const accessToken = generateAccessToken({
        userId: user.id,
    });
    const refreshToken = generateRefreshToken({
        userId: user.id,
    });

    await db.insert(refreshTokens).values({
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            userName: user.userName,
            tier: user.tier,
        },
        accessToken,
        refreshToken,
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

    const accessToken = generateAccessToken({
        userId: user.id,
    });
    const refreshToken = generateRefreshToken({
        userId: user.id,
    });

    await db.insert(refreshTokens).values({
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            userName: user.userName,
            tier: user.tier,
        },
        accessToken,
        refreshToken,
    };
}

const getCurrentUser = async (userId: string) => {

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
        avatar: user.avatar,
        tier: user.tier,
    };
}

const getGoogleAuthorizationURL = () => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "select_account",
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
    const googleAccessToken = tokenResponse.access_token;

    if (!googleAccessToken) {
        throw new Error("Google did not return an access token.");
    }

    const googleUserProfile = (await getGoogleUserprofile(googleAccessToken)) as GoogleProfile;
    const providerId = String(googleUserProfile.sub || googleUserProfile.id);

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

        const accessToken = generateAccessToken({ userId: existingUser.id });
        const refreshToken = generateRefreshToken({ userId: existingUser.id });

        await db.insert(refreshTokens).values({
            userId: existingUser.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return {
            user: {
                id: existingUser.id,
                email: existingUser.email,
                userName: existingUser.userName,
                avatar: existingUser.avatar,
                tier: existingUser.tier,
            },
            accessToken,
            refreshToken,
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
                avatar: googleUserProfile.picture,
            })
            .returning();

        localUser = createdUser;
    } else if (!localUser.avatar && googleUserProfile.picture) {
        const [updatedUser] = await db
            .update(users)
            .set({ avatar: googleUserProfile.picture })
            .where(eq(users.id, localUser.id))
            .returning();
        localUser = updatedUser;
    }

    await db
        .insert(userProviders)
        .values({
            userId: localUser.id,
            provider: "google",
            providerId,
        })
        .onConflictDoNothing();

    const accessToken = generateAccessToken({ userId: localUser.id });
    const refreshToken = generateRefreshToken({ userId: localUser.id });

    await db.insert(refreshTokens).values({
        userId: localUser.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
        user: {
            id: localUser.id,
            email: localUser.email,
            userName: localUser.userName,
            avatar: localUser.avatar,
            tier: localUser.tier,
        },
        accessToken,
        refreshToken,
    };
};

const revokeRefreshTokenService = async (token: string) => {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
};

const refreshTokenService = async (oldToken: string) => {
    let payload;
    try {
        payload = verifyToken(oldToken);
    } catch (err) {
        throw new Error("Invalid or expired refresh token.");
    }

    const existingToken = await db.query.refreshTokens.findFirst({
        where: eq(refreshTokens.token, oldToken),
    });

    if (!existingToken || existingToken.expiresAt < new Date()) {
        if (existingToken) {
            await db.delete(refreshTokens).where(eq(refreshTokens.token, oldToken));
        }
        throw new Error("Invalid or expired refresh token.");
    }

    await db.delete(refreshTokens).where(eq(refreshTokens.token, oldToken));

    const accessToken = generateAccessToken({ userId: payload.userId });
    const refreshToken = generateRefreshToken({ userId: payload.userId });

    await db.insert(refreshTokens).values({
        userId: payload.userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
        accessToken,
        refreshToken,
    };
};

export { registerService, loginService, getCurrentUser, getGoogleAuthorizationURL, exchangeGoogleCode, getGoogleUserprofile, handleGoogleLogin, revokeRefreshTokenService, refreshTokenService };