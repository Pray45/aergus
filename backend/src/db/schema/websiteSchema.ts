import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const website = pgTable(
  "website",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    resourceId: uuid("resource_id").notNull(),
    url: text("url").notNull(),
    hostname: text("hostname").notNull(),
    protocol: text("protocol").notNull(),
    port: integer("port").notNull(),
    monitoringEnabled: boolean("monitoring_enabled").default(true).notNull(),
    checkInterval: integer("check_interval").default(5).notNull(), // 5 minutes
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    resourceIdUnique: unique().on(table.resourceId),
  }),
);
