export interface CreateProjectDTO {
  name: string;
  description?: string;
  companyId: string;
  ownerId: string;
}

export interface ListProjectsDTO {
  companyId: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface UpdateProjectDTO {
  projectId: string;
  companyId: string;
  name?: string;
  description?: string;
}

export interface FindProjectByIdDTO {
  projectId: string;
  companyId: string;
}

export interface DeleteProjectDTO {
  projectId: string;
  companyId: string;
}

