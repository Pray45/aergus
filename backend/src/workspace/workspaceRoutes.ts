import express from "express";
import {
  createWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  getAllProjectsOfWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from "./workspaceController.js";
import { protect } from "../middleware/authMiddleware.js";

const workspaceRouter = express.Router();

workspaceRouter.post("/", protect, createWorkspace);
workspaceRouter.get("/", protect, getAllWorkspaces);
workspaceRouter.get("/:id", protect, getWorkspaceById);
workspaceRouter.get("/:id/projects", protect, getAllProjectsOfWorkspace);
workspaceRouter.patch("/:id", protect, updateWorkspace);
workspaceRouter.delete("/:id", protect, deleteWorkspace);

export default workspaceRouter;
