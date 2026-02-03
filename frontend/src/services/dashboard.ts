import { api } from "@/lib/api";
import { TaskStatus, Priority } from "@/types";

export interface DashboardStats {
  overview: {
    totalProjects: number;
    totalTasks: number;
    totalMembers: number;
  };
  tasksDistribution: {
    [key in TaskStatus]: number;
  };
  myRecentTasks: {
    id: string;
    title: string;
    priority: Priority;
    project: {
      id: string;
      name: string;
    };
    updatedAt: string;
  }[];
}

export const getDashboardStats = async () => {
  const response = await api.get<DashboardStats>("/dashboard");
  return response.data;
};