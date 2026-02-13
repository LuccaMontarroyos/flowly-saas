import { z } from "zod";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";

export type RegisterForm = z.infer<typeof registerSchema>;
export type LoginForm = z.infer<typeof loginSchema>;