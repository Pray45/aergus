import exrpess from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getResourcesByProjectId,
  createResource,
  getResourceById,
  updateResource,
  deleteResource,
} from "./resourceController.js";

const resourceRoute = exrpess.Router();

resourceRoute.get("/:projectId/resources", protect, getResourcesByProjectId);
resourceRoute.post("/:projectId/resources", protect, createResource);

resourceRoute.get("/:resourceId", protect, getResourceById);
resourceRoute.patch("/:resourceId", protect, updateResource);
resourceRoute.delete("/:resourceId", protect, deleteResource);

export default resourceRoute;
