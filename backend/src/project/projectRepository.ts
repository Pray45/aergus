import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { project } from "../db/schema/projectSchema.js";

export const create = async (data: typeof project.$inferInsert) => {
  const [newProject] = await db.insert(project).values(data).returning();
  return newProject;
};

export const findById = async (id: string) => {
  const [found] = await db.select().from(project).where(eq(project.id, id));
  return found ?? null;
};

export const findBySlugAndWorkspace = async (slug: string, workspaceId: string) => {
  const [found] = await db
    .select()
    .from(project)
    .where(and(eq(project.slug, slug), eq(project.workspaceId, workspaceId)));
  return found ?? null;
};

export const findByWorkspaceId = async (workspaceId: string) => {
  return await db.select().from(project).where(eq(project.workspaceId, workspaceId));
};

export const update = async (projectId: string, payload: Partial<typeof project.$inferInsert>) => {
  const [updated] = await db
    .update(project)
    .set(payload)
    .where(eq(project.id, projectId))
    .returning();
  return updated ?? null;
};

export const deleteProject = async (projectId: string) => {
  await db.delete(project).where(eq(project.id, projectId));
};
