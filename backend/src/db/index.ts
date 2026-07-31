import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/userSchema.js";
import * as workspaceSchema from "./schema/workspaceSchema.js";
import * as projectSchema from "./schema/projectSchema.js";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    ...schema,
    ...workspaceSchema,
    ...projectSchema,
  },
});
