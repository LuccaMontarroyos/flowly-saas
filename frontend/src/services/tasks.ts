import { api } from "@/lib/api";
import { KanbanBoardData, Task, TaskStatus, Priority } from "@/types";
import { CreateTaskForm, EditTaskForm } from "@/modules/tasks/task.types";

export interface TaskFilters {
  search?: string;
  assigneeId?: string;
  priority?: string;
}

export const getProjectTasks = async (projectId: string, filters?: TaskFilters) => {
  const response = await api.get<KanbanBoardData>(`/tasks/project/${projectId}`, {
    params: filters
  });
  return response.data;
};

export const createTask = async (projectId: string, data: CreateTaskForm) => {
  const payload = { ...data, projectId };
  const response = await api.post<Task>("/tasks", payload);
  return response.data;
};

export const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
  const response = await api.put<Task>(`/tasks/${taskId}`, { status: newStatus });
  return response.data;
};

export const updateTask = async (taskId: string, data: Partial<EditTaskForm>) => {
  const response = await api.put<Task>(`/tasks/${taskId}`, data);
  return response.data;
};

export const moveTask = async (taskId: string, newStatus: TaskStatus, newIndex: number) => {
  const response = await api.put<Task>(`/tasks/${taskId}/move`, { 
    status: newStatus, 
    index: newIndex 
  });
  return response.data;
};

export const deleteTask = async (taskId: string) => {
  await api.delete(`/tasks/${taskId}`)
}
