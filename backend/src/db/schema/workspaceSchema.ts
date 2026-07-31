import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./userSchema.js";

export const workspaceRole = pgEnum("role", [
  "OWNER",
  "ADMIN",
  "MEMBER",
  "VIEWER",
]);

export const workspace = pgTable("workspace", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  logo: text("logo"),
  description: text("description"),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    workspaceId: integer("workspace_id")
      .notNull()
      .references(() => workspace.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    role: workspaceRole("role").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    workspaceMemberUnique: unique().on(table.workspaceId, table.userId),
  }),
);
