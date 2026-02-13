import { Request, Response, NextFunction } from "express";
import { Priority, TaskStatus } from "@prisma/client";
import { z } from "zod";
import { TaskService } from "./task.service";
import {
  createTaskSchema,
  deleteTaskParamsSchema,
  listTasksParamsSchema,
  listTasksQuerySchema,
  moveTaskBodySchema,
  moveTaskParamsSchema,
  updateTaskBodySchema,
  updateTaskParamsSchema,
} from "./task.schema";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, projectId, assigneeId, status, priority, tags } =
        createTaskSchema.parse(req.body);
      const { companyId } = req.user;

      const task = await this.taskService.create({
        title,
        description,
        projectId,
        companyId,
        assigneeId: assigneeId || undefined,
        status,
        priority,
        tags,
      });

      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  listByProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = listTasksParamsSchema.parse(req.params);
      const filters = listTasksQuerySchema.parse(req.query);
      const { companyId } = req.user;

      const kanbanBoard = await this.taskService.listByProject({
        projectId,
        companyId,
        search: filters.search,
        assigneeId: filters.assigneeId || undefined,
        priority: filters.priority,
      });

      return res.json(kanbanBoard);
    } catch (error) {
      next(error);
    }
  };

  move = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = moveTaskParamsSchema.parse(req.params);
      const { status, index } = moveTaskBodySchema.parse(req.body);

      const task = await this.taskService.updatePosition(id, status as any, index);
      return res.json(task);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = updateTaskParamsSchema.parse(req.params);
      const { title, description, status, assigneeId, priority, tags } =
        updateTaskBodySchema.parse(req.body);

      const { companyId } = req.user;

      const updatedTask = await this.taskService.update({
        taskId: id,
        companyId,
        title,
        description,
        status,
        assigneeId: (assigneeId === null || assigneeId === "") ? undefined : assigneeId,
        priority,
        tags,
      });

      return res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = deleteTaskParamsSchema.parse(req.params);
      const { companyId } = req.user;

      await this.taskService.delete(id, companyId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}