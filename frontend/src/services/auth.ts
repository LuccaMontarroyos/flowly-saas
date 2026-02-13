import { api } from "@/lib/api";

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  await api.post("/auth/forgot-password", payload);
}

export async function resetPassword(payload: ResetPasswordPayload) {
  await api.post("/auth/reset-password", payload);
}

