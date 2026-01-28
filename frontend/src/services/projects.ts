import { api } from "@/lib/api";
import { Project } from "@/types";
import { ProjectForm } from "@/modules/projects/project.types";

interface ProjectsResponse {
  data: Project[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export const getProjects = async (page = 1, limit = 100, search?: string) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append("search", search);
  }

  const response = await api.get<ProjectsResponse>(`/projects?${params.toString()}`);
  return response.data;
};

export const createProject = async (data: ProjectForm) => {
  const response = await api.post<Project>("/projects", data);
  return response.data;
};

export const updateProject = async (id: string, data: ProjectForm) => {
  const response = await api.put<Project>(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string) => {
  await api.delete(`/projects/${id}`);
};