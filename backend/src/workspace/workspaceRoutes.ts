import express from "express";
import {
  createWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} from "./workspaceController.js";
import { protect } from "../middleware/authMiddleware.js";

const workspaceRouter = express.Router();

workspaceRouter.post("/", protect, createWorkspace);
workspaceRouter.get("/", protect, getAllWorkspaces);
workspaceRouter.get("/:id", protect, getWorkspaceById);
workspaceRouter.patch("/:id", protect, updateWorkspace);
workspaceRouter.delete("/:id", protect, deleteWorkspace);

export default workspaceRouter;
