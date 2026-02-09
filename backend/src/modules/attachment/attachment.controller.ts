import { Request, Response, NextFunction } from "express";
import { AttachmentService } from "./attachment.service";
import { z } from "zod";

export class AttachmentController {
  private attachmentService = new AttachmentService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = z.object({
        taskId: z.uuid(),
        name: z.string(),
        url: z.url(),
        type: z.string(),
        size: z.number(),
      });

      const data = schema.parse(req.body);
      const attachment = await this.attachmentService.create(data);

      return res.status(201).json(attachment);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paramsSchema = z.object({
        id: z.uuid(),
      });
      const { id } = paramsSchema.parse(req.params);
      await this.attachmentService.delete(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paramsSchema = z.object({
        taskId: z.uuid(),
      });

      const { taskId } = paramsSchema.parse(req.params);
      const attachments = await this.attachmentService.listByTask(taskId);
      return res.json(attachments);
    } catch (error) {
      next(error);
    }
  };
}