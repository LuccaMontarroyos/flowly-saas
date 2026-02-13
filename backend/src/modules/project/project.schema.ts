import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

export const listProjectsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const projectIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateProjectBodySchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
});

