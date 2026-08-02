import {
    pgTable,
    text,
    timestamp,
    unique,
    uuid,
    pgEnum
} from "drizzle-orm/pg-core";

export const userTier = pgEnum("tier", [
    "developer",
    "team",
    "enterprise",
]);

export const users = pgTable("users", {

    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    userName: text("userName").notNull(),
    avatar: text("avatar"),
    passwordHash: text("password_hash"),
    tier: userTier("tier").default("developer").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

});


export const userProviders = pgTable(
    "user_providers",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id").notNull().references(() => users.id),
        provider: text("provider").notNull(),
        providerId: text("provider_id").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull()
    },
    (table) => ({
        providerUnique: unique().on(table.provider, table.providerId)
    })
);


export const refreshTokens = pgTable("refresh_tokens", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});