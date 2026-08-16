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

export const Status = pgEnum("status", [
  "ACTIVE",
  "INACTIVE",
  "LOADING",
  "FAILED",
]);

export const ResourceType = pgEnum("type", [
  // Web
  "WEBSITE",
  "API",
  "DOMAIN",
  "DNS_ZONE",

  // Compute
  "SERVER",
  "AGENT",
  "VIRTUAL_MACHINE",
  "BARE_METAL",

  // Containers
  "DOCKER_HOST",
  "CONTAINER",

  // Databases
  "POSTGRESQL",
  "MYSQL",
  "MONGODB",
  "REDIS",

  // Kubernetes
  "KUBERNETES_CLUSTER",

  // Networking
  "REVERSE_PROXY",
  "LOAD_BALANCER",

  // Cloud
  "CLOUD_ACCOUNT",

  // Infrastructure services
  "CDN",
  "STORAGE",
]);

export type ResourceTypeValue = (typeof ResourceType.enumValues)[number];

export type ResourceStatusValue = (typeof Status.enumValues)[number];

export const resources = pgTable("resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id),

  name: text("name").notNull(),
  status: Status().default("INACTIVE").notNull(),
  provider: text("provider").notNull(),
  description: text("description").notNull(),
  type: ResourceType(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
