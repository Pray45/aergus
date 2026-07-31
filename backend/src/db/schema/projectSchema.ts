import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./userSchema.js";
import { workspace } from "./workspaceSchema.js";

export const project = pgTable("project", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspace.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  logo: text("logo"),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
