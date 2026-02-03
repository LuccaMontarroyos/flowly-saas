import { Request, Response, NextFunction } from "express";
import { CommentService } from "./comment.service";
import { z } from "zod";

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = z.object({
        content: z.string().min(1),
        taskId: z.uuid(),
      });

      const { content, taskId } = schema.parse(req.body);
      const userId = req.user.id;

      const comment = await this.commentService.create({ content, taskId, userId });
      return res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  };

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId } = req.params;
        if (typeof taskId !== "string") {
            throw new Error("Invalid task id");
        }
        const comments = await this.commentService.listByTask(taskId);
        return res.json(comments);
    } catch (error) {
        next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === "ADMIN";

        if (typeof id !== "string") {
          throw new Error("Invalid comment id");
        }

        await this.commentService.delete(id, userId, isAdmin);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
  };
}