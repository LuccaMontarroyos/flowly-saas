export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  companyId: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  taskCount: number;
  ownerId: string;
  companyId: string;
  createdAt: string;
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  projectId: string;
  assigneeId: string | null;
  assignee?: {
    id: string;
    name: string;
    email: string;
  } | null;
  order: number;
  createdAt: string;
}

export interface KanbanBoardData {
  TODO: Task[];
  IN_PROGRESS: Task[];
  DONE: Task[];
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}