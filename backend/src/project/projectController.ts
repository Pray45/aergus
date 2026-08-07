import { Request, Response, NextFunction } from "express";
import * as projectRepository from "./projectRepository.js";
import { project } from "../db/schema/projectSchema.js";
import slugify from "slugify";
import { randomUUID } from "crypto";

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { workspaceId, name, description, logo } = req.body;

    if (!workspaceId || !name) {
      return res.status(400).json({
        success: false,
        message: "Workspace ID and project name are required.",
      });
    }

    const slug = slugify.default ? slugify.default(name, { lower: true, strict: true }) : slugify(name, { lower: true, strict: true });

    const existing = await projectRepository.findBySlugAndWorkspace(slug, workspaceId);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Project with this name already exists in the workspace.",
      });
    }

    const newProject = await projectRepository.create({
      id: randomUUID(),
      workspaceId,
      name,
      slug,
      description,
      logo,
      ownerId: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = req.query;

    if (!workspaceId || typeof workspaceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Workspace ID is required as a query parameter.",
      });
    }

    const projects = await projectRepository.findByWorkspaceId(workspaceId);

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const foundProject = await projectRepository.findById(id as string);

    if (!foundProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: foundProject,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, logo } = req.body;

    const existing = await projectRepository.findById(id as string);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const updateData: Partial<typeof project.$inferInsert> = { description, logo };

    if (name) {
      const slug = slugify.default ? slugify.default(name, { lower: true, strict: true }) : slugify(name, { lower: true, strict: true });
      const duplicate = await projectRepository.findBySlugAndWorkspace(slug, existing.workspaceId);
      if (duplicate && duplicate.id !== id) {
        return res.status(400).json({
          success: false,
          message: "Project with this name already exists in this workspace.",
        });
      }
      updateData.name = name;
      updateData.slug = slug;
    }

    const updated = await projectRepository.update(id as string, updateData);

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await projectRepository.findById(id as string);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    await projectRepository.deleteProject(id as string);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
