import { api } from "@/lib/api";
import { UserRole } from "@/types";
import { ProfileFormValues, ChangePasswordFormValues } from "@/modules/users/user.types";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: UserRole;
  createdAt: string;
  companyId: string;
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

export const updateUserProfile = async (data: ProfileFormValues) => {
  const response = await api.patch<User>("/users/me", { name: data.name });
  return response.data;
};

export const updateUserAvatar = async (avatarUrl: string) => {
  await api.patch("/users/avatar", { avatarUrl });
};

export const changeUserPassword = async (data: ChangePasswordFormValues) => {
  const response = await api.patch<User>("/users/me", {
    oldPassword: data.oldPassword,
    newPassword: data.newPassword
  });
  return response.data;
};

export const removeUser = async (userId: string) => {
  await api.delete(`/users/${userId}`);
};