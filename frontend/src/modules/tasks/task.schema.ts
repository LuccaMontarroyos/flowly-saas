import { z } from "zod";
import { Priority, TaskStatus } from "@/types";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  status: z.enum(TaskStatus),
  priority: z.enum(Priority),
  assigneeId: z.uuid().optional().or(z.literal("")),
});

export const editTaskSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(Priority).optional(),
  assigneeId: z.uuid().optional().nullable(),
});