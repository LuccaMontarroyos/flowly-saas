import { Request, Response, NextFunction } from "express";
import { ProjectService } from "./project.service";
import {
  createProjectSchema,
  listProjectsQuerySchema,
  projectIdParamsSchema,
  updateProjectBodySchema,
} from "./project.schema";

export class ProjectController {
    private projectService: ProjectService;

    constructor() {
        this.projectService = new ProjectService();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, description } = createProjectSchema.parse(req.body);
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
            const { page, limit, search } = listProjectsQuerySchema.parse(req.query);
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

    show = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = projectIdParamsSchema.parse(req.params);
            const { companyId } = req.user;

            const project = await this.projectService.findById({ projectId: id, companyId });

            return res.json(project);
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = projectIdParamsSchema.parse(req.params);
            const { name, description } = updateProjectBodySchema.parse(req.body);
            const { companyId } = req.user;

            const project = await this.projectService.update({
                projectId: id,
                companyId,
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
            const { id } = projectIdParamsSchema.parse(req.params);
            const { companyId } = req.user;

            await this.projectService.delete({ projectId: id, companyId });

            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}