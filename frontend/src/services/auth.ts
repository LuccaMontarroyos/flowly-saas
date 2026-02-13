import { api } from "@/lib/api";

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
}

interface VerifyEmailPayload {
  token: string;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  await api.post("/auth/forgot-password", payload);
}

export async function resetPassword(payload: ResetPasswordPayload) {
  await api.post("/auth/reset-password", payload);
}

export async function verifyEmail(payload: VerifyEmailPayload) {
  const response = await api.post("/auth/verify-email", payload);
  return response.data;
}

