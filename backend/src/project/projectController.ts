import { Request, Response, NextFunction } from "express";
import * as projectRepository from "./projectRepository.js";
import {
  createProjectService,
  updateProjectService,
} from "./projectServices.js";

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const newProject = await createProjectService({
      workspaceId: req.body.workspaceId,
      name: req.body.name,
      description: req.body.description,
      logo: req.body.logo,
      userId,
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

export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId } = req.query;

    if (!workspaceId || typeof workspaceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Workspace ID is required as a query parameter.",
      });
    }

    const projects =
      await projectRepository.findProjectByWorkspaceId(workspaceId);

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const foundProject = await projectRepository.findProjectById(id as string);

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

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const updated = await updateProjectService({
      id: id as string,
      name: req.body.name,
      description: req.body.description,
      logo: req.body.logo,
    });

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const existing = await projectRepository.findProjectById(id as string);
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
