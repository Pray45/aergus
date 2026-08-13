import { db } from "../db/index.js";
import {
  resources,
  ResourceType,
  ResourceStatus,
} from "../db/schema/resourcesSchema.js";
import { eq } from "drizzle-orm";

export interface CreateResourceData {
  projectId: string;
  workspaceId: string;
  type: ResourceType;
  name: string;
  provider?: string | null;
  description?: string | null;
  status?: ResourceStatus;
  metadata?: Record<string, unknown>;
}

export const createResourceRepository = async (body: CreateResourceData) => {
  try {
    const [createResource] = await db
      .insert(resources)
      .values(body)
      .returning();
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
  type,
  description,
  metadata,
  status,
}: {
  resourceId: string;
  name?: string;
  type?: ResourceType;
  description?: string;
  metadata?: Record<string, unknown>;
  status?: ResourceStatus;
}) => {
  const [updatedResource] = await db
    .update(resources)
    .set({
      name,
      type,
      description,
      metadata,
      status,
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
