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

export const resourceStatus = pgEnum("resource_status", [
  "ACTIVE",
  "INACTIVE",
  "LOADING",
  "FAILED",
]);
export const Status = resourceStatus;
export type ResourceStatus = (typeof resourceStatus.enumValues)[number];

export const resourceType = pgEnum("resource_type", [
  "WEBSITE",
  "API",
  "DOMAIN",
  "DNS_ZONE",
  "SERVER",
  "AGENT",
  "VIRTUAL_MACHINE",
  "BARE_METAL",
  "DOCKER_HOST",
  "CONTAINER",
  "POSTGRESQL",
  "MYSQL",
  "MONGODB",
  "REDIS",
  "KUBERNETES_CLUSTER",
  "REVERSE_PROXY",
  "LOAD_BALANCER",
  "CLOUD_ACCOUNT",
  "CDN",
  "STORAGE",
]);
export const Type = resourceType;
export type ResourceType = (typeof resourceType.enumValues)[number];



export const resources = pgTable("resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, {
      onDelete: "cascade",
    }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id, {
      onDelete: "cascade",
    }),
  type: resourceType("type").notNull(),
  name: text("name").notNull(),
  status: resourceStatus("status")
    .default("INACTIVE")
    .notNull(),

  provider: text("provider"),
  description: text("description"),
  metadata: jsonb("metadata")
    .$type<Record<string, unknown>>()
    .default({}),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});