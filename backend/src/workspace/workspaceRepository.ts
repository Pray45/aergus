import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { workspace } from "../db/schema/workspaceSchema.js";

export const create = async (data: typeof workspace.$inferInsert) => {
  const [newWorkspace] = await db.insert(workspace).values(data).returning();
  return newWorkspace;
};

export const findBySlug = async (slug: string) => {
  const [foundWorkspace] = await db
    .select()
    .from(workspace)
    .where(eq(workspace.slug, slug));

  return foundWorkspace ?? null;
};
