import { db } from "../db/index.js";
import { resources } from "../db/schema/resourcesSchema.js";
import { eq } from "drizzle-orm";

export const createResourceRepository = async (body: any) => {
  try {
    const createResource = await db.insert(resources).values(body);
    return createResource;
  } catch (error) {
    throw error;
  }
};

// Get all resources belonging to a project
export const findResourcesByProjectId = async (projectId: string) => {
  return await db
    .select()
    .from(resources)
    .where(eq(resources.projectId, projectId));
};

// Get one resource
export const findResourceById = async (resourceId: string) => {
  const [result] = await db
    .select()
    .from(resources)
    .where(eq(resources.id, resourceId))
    .limit(1);

  return result ?? null;
};

// Update resource
export const updateResourceRepository = async ({
  resourceId,
  name,
  description,
  metadata,
}: {
  resourceId: string;
  name?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}) => {
  const [updatedResource] = await db
    .update(resources)
    .set({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(metadata !== undefined && { metadata }),
      updatedAt: new Date(),
    })
    .where(eq(resources.id, resourceId))
    .returning();

  return updatedResource ?? null;
};

// Delete resource
export const deleteResourceRepository = async (resourceId: string) => {
  const [deletedResource] = await db
    .delete(resources)
    .where(eq(resources.id, resourceId))
    .returning();

  return deletedResource ?? null;
};
