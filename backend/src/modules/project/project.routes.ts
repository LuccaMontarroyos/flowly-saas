import { Router } from "express";
import { ProjectController } from "./project.controller";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { ensureAdmin } from "../../shared/middlewares/ensureAdmin";

const projectRoutes = Router();
const projectController = new ProjectController();

projectRoutes.use(ensureAuthenticated);
projectRoutes.get("/", projectController.index);
projectRoutes.post("/", projectController.create);
projectRoutes.put("/:id", projectController.update);
projectRoutes.delete("/:id", ensureAdmin, projectController.remove);

export { projectRoutes };