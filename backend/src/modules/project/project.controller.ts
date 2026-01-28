import { Request, Response, NextFunction } from "express";
import { ProjectService } from "./project.service";
import { z } from "zod";

export class ProjectController {
    private projectService: ProjectService;

    constructor() {
        this.projectService = new ProjectService();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const schema = z.object({
                name: z.string().min(3),
                description: z.string().optional(),
            });

            const { name, description } = schema.parse(req.body);
            const { companyId, id: ownerId } = req.user;

            const project = await this.projectService.create({
                name,
                description,
                companyId,
                ownerId,
            });

            return res.status(201).json(project);
        } catch (error) {
            next(error);
        }
    };

    index = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const querySchema = z.object({
                page: z.coerce.number().min(1).default(1),
                limit: z.coerce.number().min(1).max(100).default(10),
                search: z.string().optional(),
              });

            const { page, limit, search } = querySchema.parse(req.query);
            const { companyId } = req.user;

            const result = await this.projectService.list({
                companyId,
                page,
                limit,
                search,
            });

            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paramsSchema = z.object({
                id: z.string().uuid(),
            });
            const bodySchema = z.object({
                name: z.string().min(3).optional(),
                description: z.string().optional(),
            });

            const { id } = paramsSchema.parse(req.params);
            const { name, description } = bodySchema.parse(req.body);
            const { companyId } = req.user;

            const project = await this.projectService.update(id, companyId, {
                name,
                description,
            });

            return res.json(project);
        } catch (error) {
            next(error);
        }
    }

    remove = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paramsSchema = z.object({
                id: z.string().uuid(),
            });

            const { id } = paramsSchema.parse(req.params);
            const { companyId } = req.user;

            await this.projectService.delete(id, companyId);

            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}