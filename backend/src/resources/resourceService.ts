import { findProjectById } from "../project/projectRepository.js";
import {
  canUpdateWorkspace,
  hasAccess,
} from "../workspace/workspaceRepository.js";
import { createResourceRepository } from "./resourceRepository.js";
import {
  findResourcesByProjectId,
  findResourceById,
  updateResourceRepository,
  deleteResourceRepository,
} from "./resourceRepository.js";

export const createResourceService = async ({
  userId,
  projectId,
  name,
  description,
  provider,
}: {
  userId: string;
  projectId: string;
  name: string;
  description: string;
  provider: string;
}) => {
  try {
    if (!name || !projectId || !provider || !description) {
      throw new Error("Missing required fields");
    }

    const isprojectId = await findProjectById(projectId);
    if (!isprojectId) {
      throw new Error("Project not found");
    }

    const canupdate = await canUpdateWorkspace(isprojectId.workspaceId, userId);
    if (!canupdate) {
      throw new Error("user is not authorized to create this resource ");
    }

    const resource = await createResourceRepository({
      projectId,
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
  projectId,
  resourceId,
}: {
  userId: string;
  projectId: string;
  resourceId: string;
}) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const canAccess = await hasAccess(project.workspaceId, userId);

  if (!canAccess) {
    throw new Error("User is not authorized to access this workspace");
  }

  const resource = await findResourceById(resourceId);

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (resource.projectId !== projectId) {
    throw new Error("Resource does not belong to this project");
  }

  return resource;
};

export const updateResourceService = async ({
  userId,
  projectId,
  resourceId,
  name,
  description,
}: {
  userId: string;
  projectId: string;
  resourceId: string;
  name?: string;
  description?: string;
}) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const canAccess = await hasAccess(project.workspaceId, userId);

  if (!canAccess) {
    throw new Error("User is not authorized to update this resource");
  }

  const resource = await findResourceById(resourceId);

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (resource.projectId !== projectId) {
    throw new Error("Resource does not belong to this project");
  }

  const updatedResource = await updateResourceRepository({
    resourceId,
    name,
    description,
  });

  return updatedResource;
};

export const deleteResourceService = async ({
  userId,
  projectId,
  resourceId,
}: {
  userId: string;
  projectId: string;
  resourceId: string;
}) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const canAccess = await hasAccess(project.workspaceId, userId);

  if (!canAccess) {
    throw new Error("User is not authorized to delete this resource");
  }

  const resource = await findResourceById(resourceId);

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (resource.projectId !== projectId) {
    throw new Error("Resource does not belong to this project");
  }

  await deleteResourceRepository(resourceId);

  return {
    id: resourceId,
  };
};
