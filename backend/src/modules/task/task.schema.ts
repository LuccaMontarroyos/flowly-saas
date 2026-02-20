import { Priority, TaskStatus } from "@prisma/client";
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.uuid(),
  assigneeId: z.union([z.uuid(), z.literal("")]).optional(),
  status: z.enum(TaskStatus),
  priority: z.enum(Priority).optional(),
  tags: z.array(z.string()).optional(),
});

export const listTasksParamsSchema = z.object({
  projectId: z.uuid(),
});

export const listTasksQuerySchema = z.object({
  search: z.string().optional(),
  assigneeId: z.union([z.uuid(), z.literal("")]).optional(),
  priority: z.string().optional(),
});

export const moveTaskParamsSchema = z.object({
  id: z.uuid(),
});

export const moveTaskBodySchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  index: z.number().min(0),
});

export const updateTaskParamsSchema = z.object({
  id: z.uuid(),
});

export const updateTaskBodySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(TaskStatus).optional(),
  assigneeId: z.union([z.uuid(), z.literal(""), z.null()]).optional(),
  priority: z.enum(Priority).optional(),
  tags: z.array(z.string()).optional(),
});

export const deleteTaskParamsSchema = z.object({
  id: z.uuid(),
});

