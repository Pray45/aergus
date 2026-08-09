import {
  createWorkspaceService,
  updateWorkspaceService,
  addWorkspaceMemberService,
} from "./workspaceService.js";
import * as workspaceRepository from "./workspaceRepository.js";
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
  } catch (error: any) {
    if (
      error.message.includes("limit") ||
      error.message.includes("upgrade") ||
      error.message.includes("tier")
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message.includes("already exists")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

export const getAllWorkspaces = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const workspaces = await workspaceRepository.findUserWorkspaces(userId);

    return res.status(200).json({
      success: true,
      message: "Workspaces fetched successfully",
      data: workspaces,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

export const getWorkspaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user.id;

    const workspace = await workspaceRepository.findWorkspaceById(id as string);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const hasAccess = await workspaceRepository.hasAccess(id as string, userId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this workspace",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Workspace fetched successfully",
      data: workspace,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

export const updateWorkspace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user.id;

    const workspace = await workspaceRepository.findWorkspaceById(id as string);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const canUpdate = await workspaceRepository.canUpdateWorkspace(
      id as string,
      userId,
    );
    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this workspace",
      });
    }

    const updatedWorkspace = await updateWorkspaceService(
      id as string,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      data: updatedWorkspace,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user.id;

    const workspace = await workspaceRepository.findWorkspaceById(id as string);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const isOwner = await workspaceRepository.isWorkspaceOwner(
      id as string,
      userId,
    );
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can delete this workspace",
      });
    }

    await workspaceRepository.deleteWorkspace(id as string);

    return res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

export const addWorkspaceMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: workspaceId } = req.params;
    const { email, role } = req.body;
    // @ts-ignore
    const userId = req.user.id;

    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: "Email and role are required.",
      });
    }

    if (!["ADMIN", "MEMBER", "VIEWER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be ADMIN, MEMBER, or VIEWER.",
      });
    }

    await addWorkspaceMemberService(workspaceId as string, userId, email, role);

    return res.status(200).json({
      success: true,
      message: "Member added successfully.",
    });
  } catch (error: any) {
    if (error.message === "Workspace not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (
      error.message.includes("permission") ||
      error.message.includes("upgrade")
    ) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error.message.includes("already") || error.message.includes("exist")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};
