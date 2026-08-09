import { eq, or, and, exists } from "drizzle-orm";
import { db } from "../db/index.js";
import { workspace, workspaceMembers } from "../db/schema/workspaceSchema.js";

export const createWorkspace = async (data: typeof workspace.$inferInsert) => {
  const [newWorkspace] = await db.insert(workspace).values(data).returning();
  return newWorkspace;
};

export const findWorkspaceBySlug = async (slug: string) => {
  const [foundWorkspace] = await db
    .select()
    .from(workspace)
    .where(eq(workspace.slug, slug));

  return foundWorkspace ?? null;
};

export const findWorkspaceById = async (id: string) => {
  const [foundWorkspace] = await db
    .select()
    .from(workspace)
    .where(eq(workspace.id, id));

  return foundWorkspace ?? null;
};

export const findWorkspaceByOwnerId = async (userId: string) => {
  const foundWorkspaces = await db
    .select()
    .from(workspace)
    .where(eq(workspace.ownerId, userId));

  return foundWorkspaces;
};

export const findUserWorkspaces = async (userId: string) => {
  return await db
    .select()
    .from(workspace)
    .where(
      or(
        eq(workspace.ownerId, userId),
        exists(
          db
            .select()
            .from(workspaceMembers)
            .where(
              and(
                eq(workspaceMembers.workspaceId, workspace.id),
                eq(workspaceMembers.userId, userId),
              ),
            ),
        ),
      ),
    );
};

export const hasAccess = async (
  workspaceId: string,
  userId: string,
): Promise<boolean> => {
  const [result] = await db
    .select({ id: workspace.id })
    .from(workspace)
    .where(
      and(
        eq(workspace.id, workspaceId),
        or(
          eq(workspace.ownerId, userId),
          exists(
            db
              .select()
              .from(workspaceMembers)
              .where(
                and(
                  eq(workspaceMembers.workspaceId, workspace.id),
                  eq(workspaceMembers.userId, userId),
                ),
              ),
          ),
        ),
      ),
    );
  return !!result;
};

export const canUpdateWorkspace = async (
  workspaceId: string,
  userId: string,
): Promise<boolean> => {
  const [result] = await db
    .select({ id: workspace.id })
    .from(workspace)
    .where(
      and(
        eq(workspace.id, workspaceId),
        or(
          eq(workspace.ownerId, userId),
          exists(
            db
              .select()
              .from(workspaceMembers)
              .where(
                and(
                  eq(workspaceMembers.workspaceId, workspace.id),
                  eq(workspaceMembers.userId, userId),
                  or(
                    eq(workspaceMembers.role, "OWNER"),
                    eq(workspaceMembers.role, "ADMIN"),
                    eq(workspaceMembers.role, "MEMBER")
                  ),
                ),
              ),
          ),
        ),
      ),
    );
  return !!result;
};

export const isWorkspaceOwner = async (
  workspaceId: string,
  userId: string,
): Promise<boolean> => {
  const [result] = await db
    .select({ id: workspace.id })
    .from(workspace)
    .where(and(eq(workspace.id, workspaceId), eq(workspace.ownerId, userId)));
  return !!result;
};

export const addMember = async (
  workspaceId: string,
  userId: string,
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER",
) => {
  await db.insert(workspaceMembers).values({
    workspaceId,
    userId,
    role,
  });
};

export const updateWorkspace = async (
  workspaceId: string,
  payload: Partial<typeof workspace.$inferInsert>,
) => {
  const [updatedWorkspace] = await db
    .update(workspace)
    .set(payload)
    .where(eq(workspace.id, workspaceId))
    .returning();

  return updatedWorkspace ?? null;
};

export const deleteWorkspace = async (workspaceId: string) => {
  await db
    .delete(workspaceMembers)
    .where(eq(workspaceMembers.workspaceId, workspaceId));
  await db.delete(workspace).where(eq(workspace.id, workspaceId));
};