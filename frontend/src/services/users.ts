import { api } from "@/lib/api";
import { UserRole } from "@/types";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface GetUsersResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getCompanyUsers = async (page = 1, search = "", limit = 5) => {
  const response = await api.get<GetUsersResponse>("/users", {
    params: {
      page,
      limit,
      search,
    }
  });
  return response.data;
};

export const updateUserRole = async (userId: string, role: UserRole) => {
  const response = await api.patch(`/users/${userId}/role`, { role });
  return response.data;
};

export const removeUser = async (userId: string) => {
  await api.delete(`/users/${userId}`);
};