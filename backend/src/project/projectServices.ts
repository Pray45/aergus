import slugify from "slugify";
import * as projectRepository from "./projectRepository.js";
import { randomUUID } from "crypto";
import { project } from "../db/schema/projectSchema.js";
import { findWorkspaceById } from "../workspace/workspaceRepository.js";

export const createProjectService = async ({
  workspaceId,
  name,
  description,
  logo,
  userId,
}: {
  workspaceId: string;
  name: string;
  description: string;
  logo: string;
  userId: string;
}) => {
  if (!workspaceId || !name) {
    throw new Error("Workspace ID and project name are required.");
  }

  const slug = slugify.default
    ? slugify.default(name, { lower: true, strict: true })
    : slugify(name, { lower: true, strict: true });

  const isworkspace = await findWorkspaceById(workspaceId);

  if (!isworkspace) {
    throw new Error("Workspace not found");
  }

  const existing = await projectRepository.findProjectBySlugAndWorkspace(
    slug,
    workspaceId,
  );
  if (existing) {
    throw new Error("Project name already exists in workspace");
  }

  const newProject = await projectRepository.createProject({
    id: randomUUID(),
    workspaceId,
    name,
    slug,
    description,
    logo,
    ownerId: userId,
  });

  return newProject;
};

export const updateProjectService = async ({
  id,
  name,
  description,
  logo,
}: {
  id: string;
  name?: string;
  description?: string;
  logo?: string;
}) => {
  if (!id) {
    throw new Error("Project ID is required.");
  }

  const existing = await projectRepository.findProjectById(id);
  if (!existing) {
    throw new Error("Project not found.");
  }

  const updateData: Partial<typeof project.$inferInsert> = {
    description,
    logo,
  };

  if (name) {
    const slug = slugify.default
      ? slugify.default(name, { lower: true, strict: true })
      : slugify(name, { lower: true, strict: true });
    const duplicate = await projectRepository.findProjectBySlugAndWorkspace(
      slug,
      existing.workspaceId,
    );
    if (duplicate && duplicate.id !== id) {
      throw new Error("Project name already exists in this workspace.");
    }
    updateData.name = name;
    updateData.slug = slug;
  }

  const updated = await projectRepository.updateProject(id, updateData);

  return updated;
};
