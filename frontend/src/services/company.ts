import { api } from "@/lib/api";

export interface Company {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count?: {
    users: number;
    projects: number;
  };
}

export async function getCompany() {
  const response = await api.get<Company>("/company/me");
  return response.data;
}