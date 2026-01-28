import { z } from "zod";
import { createTaskSchema, editTaskSchema } from "./task.schema";

export type CreateTaskForm = z.infer<typeof createTaskSchema>;

export type EditTaskForm = z.infer<typeof editTaskSchema>;