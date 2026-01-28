import { z } from "zod";
import { TaskStatus } from "@/types";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  status: z.enum(TaskStatus),
  assigneeId: z.uuid().optional().or(z.literal("")),
});

export const editTaskSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  status: z.enum(TaskStatus).optional(),
  assigneeId: z.uuid().optional().nullable(),
});