import { Request, Response, NextFunction } from "express";
import { TaskService } from "./task.service";
import { z } from "zod";
import { TaskStatus } from "@prisma/client";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        projectId: z.string().uuid(),
        assigneeId: z.string().uuid().optional(),
      });

      const { title, description, projectId, assigneeId } = schema.parse(req.body);
      const { companyId } = req.user;

      const task = await this.taskService.create({
        title,
        description,
        projectId,
        companyId,
        assigneeId,
      });

      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  listByProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paramsSchema = z.object({
        projectId: z.string().uuid(),
      });

      const { projectId } = paramsSchema.parse(req.params);
      const { companyId } = req.user;

      const kanbanBoard = await this.taskService.listByProject(projectId, companyId);

      return res.json(kanbanBoard);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paramsSchema = z.object({ id: z.string().uuid() });
      const bodySchema = z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        assigneeId: z.string().uuid().nullable().optional(),
      });

      const { id } = paramsSchema.parse(req.params);
      const { title, description, status, assigneeId } = bodySchema.parse(req.body);
      const { companyId } = req.user;

      const updatedTask = await this.taskService.update({
        taskId: id,
        companyId,
        title,
        description,
        status,
        assigneeId: assigneeId === null ? undefined : assigneeId,
      });

      return res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paramsSchema = z.object({ id: z.string().uuid() });
      const { id } = paramsSchema.parse(req.params);
      const { companyId } = req.user;

      await this.taskService.delete(id, companyId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}