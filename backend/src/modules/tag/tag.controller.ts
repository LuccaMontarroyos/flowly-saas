import { Request, Response, NextFunction } from "express";
import { TagService } from "./tag.service";
import { z } from "zod";

export class TagController {
  private tagService = new TagService();

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId } = req.user;
      const tags = await this.tagService.list(companyId);
      return res.json(tags);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId } = req.user;
      const schema = z.object({
        name: z.string().min(1),
        color: z.string().min(1),
      });
      const { name, color } = schema.parse(req.body);

      const tag = await this.tagService.create(companyId, name, color);
      return res.status(201).json(tag);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paramsSchema = z.object({
        id: z.uuid().or(z.string().min(1)),
      });

      const { id } = paramsSchema.parse(req.params);

      await this.tagService.delete(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}