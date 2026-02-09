import { Router } from "express";
import { AttachmentController } from "./attachment.controller";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";

const attachmentRoutes = Router();
const controller = new AttachmentController();

attachmentRoutes.use(ensureAuthenticated);
attachmentRoutes.post("/", controller.create);
attachmentRoutes.delete("/:id", controller.delete);
attachmentRoutes.get("/task/:taskId", controller.list);

export { attachmentRoutes };