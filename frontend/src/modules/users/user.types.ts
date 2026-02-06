import { z } from "zod";
import { profileSchema, changePasswordSchema, avatarSchema } from "./user.schema";

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type AvatarFormValues = z.infer<typeof avatarSchema>;