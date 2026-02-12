import { Router } from "express";
import { TagController } from "./tag.controller";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";

const tagRoutes = Router();
const tagController = new TagController();

tagRoutes.use(ensureAuthenticated);
tagRoutes.get("/", tagController.list);
tagRoutes.post("/", tagController.create);
tagRoutes.delete("/:id", tagController.delete);

export { tagRoutes };