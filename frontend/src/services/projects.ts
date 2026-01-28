import { api } from "@/lib/api";
import { Project } from "@/types";

interface ProjectsResponse {
  data: Project[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export const getProjects = async (page = 1, limit = 100) => {
  const response = await api.get<ProjectsResponse>(`/projects?page=${page}&limit=${limit}`);
  return response.data;
};