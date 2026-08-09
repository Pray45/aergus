import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { workspace } from "./workspaceSchema.js";
import { project } from "./projectSchema.js";

export const ResourceType = pgEnum("resource_type", [
  "WEBSITE",
  "SERVER",
  "AGENT",
  "DATABASE",
  "DOCKER_HOST",
  "CONTAINER",
]);

export const Status = pgEnum("status", [
  "ACTIVE",
  "INACTIVE",
  "LOADING",
  "FAILED",
]);

export const resources = pgTable("resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id),

  name: text("name").notNull(),
  type: ResourceType(),
  status: Status(),
  provider: text("provider").notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
