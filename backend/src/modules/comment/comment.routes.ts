import { Router } from "express";
import { CommentController } from "./comment.controller";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";

const commentRoutes = Router();
const commentController = new CommentController();

commentRoutes.use(ensureAuthenticated);

commentRoutes.post("/", commentController.create);
commentRoutes.get("/task/:taskId", commentController.index);
commentRoutes.delete("/:id", commentController.delete);

export { commentRoutes };