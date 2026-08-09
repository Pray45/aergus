import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { project } from "../db/schema/projectSchema.js";

export const createProject = async (data: typeof project.$inferInsert) => {
  const [newProject] = await db.insert(project).values(data).returning();
  return newProject;
};

export const findProjectById = async (id: string) => {
  const [found] = await db.select().from(project).where(eq(project.id, id));
  return found ?? null;
};

export const findProjectBySlugAndWorkspace = async (
  slug: string,
  workspaceId: string,
) => {
  const [found] = await db
    .select()
    .from(project)
    .where(and(eq(project.slug, slug), eq(project.workspaceId, workspaceId)));
  return found ?? null;
};

export const findProjectByWorkspaceId = async (workspaceId: string) => {
  return await db
    .select()
    .from(project)
    .where(eq(project.workspaceId, workspaceId));
};

export const updateProject = async (
  projectId: string,
  payload: Partial<typeof project.$inferInsert>,
) => {
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
