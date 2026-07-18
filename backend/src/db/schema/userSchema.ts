import {
    pgTable,
    serial,
    text,
    timestamp,
    integer,
    unique
} from "drizzle-orm/pg-core";


export const users = pgTable("users", {

    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    userName: text("userName").notNull(),
    avatar: text("avatar"),
    passwordHash: text("password_hash"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

});


export const userProviders = pgTable(
    "user_providers",
    {
        id: serial("id").primaryKey(),
        userId: integer("user_id").notNull().references(() => users.id),
        provider: text("provider").notNull(),
        providerId: text("provider_id").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull()
    },
    (table) => ({
        providerUnique: unique().on(table.provider, table.providerId)
    })
);