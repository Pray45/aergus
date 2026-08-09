import { findProjectById } from "../project/projectRepository.js";
import { findWorkspaceById } from "../workspace/workspaceRepository.js";
import { createResourceRepository } from "./resourceRepository.js";

export const createResourceService = async (body: any) => {
  try {
    const {
      workspaceId,
      projectId,
      name,
      type,
      provider,
      description,
      metadata
    } = body;

    const createResource = {
      workspaceId,
      projectId,
      name,
      type,
      provider,
      description,
      metadata
    };

    if(!name || !workspaceId || !projectId || !type || !provider || !description) {
      throw new Error("Missing required fields");
    }

    const isworkspaceId = await findWorkspaceById(workspaceId);
    if(!isworkspaceId) {
      throw new Error("Workspace not found");
    }

    const isprojectId = await findProjectById(projectId);
    if(!isprojectId) {
      throw new Error("Project not found");
    }

    const resource = await createResourceRepository(createResource);
    return resource;
  } catch (error) {
    throw error;
  }
};
