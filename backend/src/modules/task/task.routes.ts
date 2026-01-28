import { Router } from "express";
import { TaskController } from "./task.controller";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.use(ensureAuthenticated);

taskRoutes.post("/", taskController.create);
taskRoutes.get("/project/:projectId", taskController.listByProject);
taskRoutes.put("/:id", taskController.update);
taskRoutes.put("/:id/move", taskController.move);
taskRoutes.delete("/:id", taskController.remove);

export { taskRoutes };