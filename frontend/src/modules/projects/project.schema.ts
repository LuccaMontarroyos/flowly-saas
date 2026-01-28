import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(3, "Min 3 characters"),
  description: z.string().optional(),
});