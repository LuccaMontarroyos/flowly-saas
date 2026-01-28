import { api } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
}

export const getCompanyUsers = async () => {
  const response = await api.get<User[]>("/users");
  return response.data;
};