import express from "express"
import { createProject, deleteProject, getAllProjects, getProjectById, updateProject } from "./projectController.js"
import { protect } from "../middleware/authMiddleware.js"

const projectRouter = express.Router()

projectRouter.use(protect)

projectRouter.post("/create", createProject)
projectRouter.get("/", getAllProjects)
projectRouter.get("/:id", getProjectById)
projectRouter.patch("/:id", updateProject)
projectRouter.delete("/:id", deleteProject)

export default projectRouter