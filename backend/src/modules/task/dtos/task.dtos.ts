import { Priority, TaskStatus } from "@prisma/client";

export interface CreateTaskDTO {
  title: string;
  description?: string;
  projectId: string;
  companyId: string;
  assigneeId?: string;
  status: TaskStatus;
  priority?: Priority;
  tags?: string[];
}

export interface UpdateTaskDTO {
  taskId: string;
  companyId: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  assigneeId?: string;
  priority?: Priority;
  tags?: string[];
}

export interface ListTaskParamsDTO {
  projectId: string;
  search?: string;
  assigneeId?: string;
  priority?: string;
  companyId: string;
}

