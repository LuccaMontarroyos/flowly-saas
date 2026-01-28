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
        projectId: z.uuid(),
        assigneeId: z.uuid().optional(),
        status: z.enum(TaskStatus),
      });

      const { title, description, projectId, assigneeId, status } = schema.parse(req.body);
      const { companyId } = req.user;

      const task = await this.taskService.create({
        title,
        description,
        projectId,
        companyId,
        assigneeId,
        status
      });

      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  listByProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paramsSchema = z.object({
        projectId: z.uuid(),
      });

      const { projectId } = paramsSchema.parse(req.params);
      const { companyId } = req.user;

      const kanbanBoard = await this.taskService.listByProject(projectId, companyId);

      return res.json(kanbanBoard);
    } catch (error) {
      next(error);
    }
  };

  move = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paramsSchema = z.object({ id: z.string().uuid() });
      const bodySchema = z.object({
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
        index: z.number().min(0),
      });

      const { id } = paramsSchema.parse(req.params);
      const { status, index } = bodySchema.parse(req.body);

      const task = await this.taskService.updatePosition(id, status as any, index);
      return res.json(task);
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