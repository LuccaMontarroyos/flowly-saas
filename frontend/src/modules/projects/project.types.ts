import { z } from "zod";
import { projectSchema } from "./project.schema";

export type ProjectForm = z.infer<typeof projectSchema>;