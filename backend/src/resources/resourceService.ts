import { findProjectById } from "../project/projectRepository.js";
import {
  canUpdateWorkspace,
  hasAccess,
} from "../workspace/workspaceRepository.js";
import {
  createResourceRepository,
  findResourcesByProjectId,
  findResourceById,
  updateResourceRepository,
  deleteResourceRepository,
} from "./resourceRepository.js";
import { ResourceStatusValue, ResourceTypeValue } from "../db/schema/resourcesSchema.js";

export const createResourceService = async ({
  userId,
  projectId,
  type,
  name,
  description,
  provider,
}: {
  userId: string;
  projectId: string;
  type: ResourceTypeValue;
  name: string;
  description: string;
  provider: string;
}) => {
  try {
    if (!name || !projectId || !type || !provider || !description) {
      throw new Error("Missing required fields");
    }

    const isProjectId = await findProjectById(projectId);
    if (!isProjectId) {
      throw new Error("Project not found");
    }

    const canupdate = await canUpdateWorkspace(isProjectId.workspaceId, userId);
    if (!canupdate) {
      throw new Error("User is not authorized to create this resource");
    }

    const resource = await createResourceRepository({
      projectId,
      workspaceId: isProjectId.workspaceId,
      type,
      name,
      description,
      provider,
    });
    return resource;
  } catch (error) {
    throw error;
  }
};

export const getProjectResourcesService = async ({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const canAccess = await hasAccess(project.workspaceId, userId);

  if (!canAccess) {
    throw new Error("User is not authorized to access this workspace");
  }

  return await findResourcesByProjectId(projectId);
};

export const getResourceService = async ({
  userId,
  resourceId,
  projectId,
}: {
  userId: string;
  resourceId: string;
  projectId?: string;
}) => {
  const resource = await findResourceById(resourceId);

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (projectId && resource.projectId !== projectId) {
    throw new Error("Resource does not belong to this project");
  }

  const canAccess = await hasAccess(resource.workspaceId, userId);

  if (!canAccess) {
    throw new Error("User is not authorized to access this workspace");
  }

  return resource;
};

export const updateResourceService = async ({
  userId,
  resourceId,
  projectId,
  name,
  type,
  description,
  status,
  metadata,
}: {
  userId: string;
  resourceId: string;
  projectId?: string;
  name?: string;
  type?: ResourceTypeValue;
  description?: string;
  status?: ResourceStatusValue;
  metadata?: Record<string, unknown>;
}) => {
  const resource = await findResourceById(resourceId);

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (projectId && resource.projectId !== projectId) {
    throw new Error("Resource does not belong to this project");
  }

  const canUpdate = await canUpdateWorkspace(resource.workspaceId, userId);

  if (!canUpdate) {
    throw new Error("User is not authorized to update this resource");
  }

  const updatedResource = await updateResourceRepository({
    resourceId,
    name,
    type,
    description,
    status,
    metadata,
  });

  return updatedResource;
};

export const deleteResourceService = async ({
  userId,
  resourceId,
  projectId,
}: {
  userId: string;
  resourceId: string;
  projectId?: string;
}) => {
  const resource = await findResourceById(resourceId);

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (projectId && resource.projectId !== projectId) {
    throw new Error("Resource does not belong to this project");
  }

  const canUpdate = await canUpdateWorkspace(resource.workspaceId, userId);

  if (!canUpdate) {
    throw new Error("User is not authorized to delete this resource");
  }

  await deleteResourceRepository(resourceId);

  return {
    id: resourceId,
  };
};
