import { createWorkspaceService } from "./workspaceService.js";
import { Request, Response, NextFunction } from "express";

export const createWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const workspace = await createWorkspaceService(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllWorkspaces = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

export const getWorkspaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

export const updateWorkspace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, size, company } = req.body;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};
