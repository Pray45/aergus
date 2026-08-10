import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
} from "./resourceController.js";

const resourceRoute = express.Router();

resourceRoute.get("/projects/:projectId", protect, getResources);
resourceRoute.post("/projects/:projectId", protect, createResource);
resourceRoute.get("/:resourceId", protect, getResource);
resourceRoute.patch("/:resourceId", protect, updateResource);
resourceRoute.delete("/:resourceId", protect, deleteResource);

export default resourceRoute;
