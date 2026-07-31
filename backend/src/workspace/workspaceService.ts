import slugify from "slugify";

import * as workspaceRepository from "./workspaceRepository.js";

export const createWorkspaceService = async (
  userId: number,
  payload: {
    name: string;
    description?: string;
  },
) => {
  const slug = slugify(payload.name, {
    lower: true,
    strict: true,
  });

  const existing = await workspaceRepository.findBySlug(slug);

  if (existing) {
    throw new Error("Workspace already exists");
  }

  const workspace = await workspaceRepository.create({
    name: payload.name,
    slug,
    description: payload.description,
    ownerId: userId,
  });

  return workspace;
};
