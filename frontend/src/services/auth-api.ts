import { api } from "@/lib/api";
import { LoginForm, RegisterForm } from "@/modules/auth/auth.types";

export async function fetchCurrentUser() {
  const response = await api.get("/users/me");
  return response.data;
}

export async function loginRequest(data: LoginForm) {
  const response = await api.post("/auth/login", data);
  return response.data;
}

export async function registerRequest(data: RegisterForm) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

