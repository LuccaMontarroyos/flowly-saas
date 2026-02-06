import { api } from "@/lib/api";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  taskId: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export const getTaskComments = async (taskId: string) => {
  const response = await api.get<Comment[]>(`/comments/task/${taskId}`);
  return response.data;
};

export const createComment = async (taskId: string, content: string) => {
  const response = await api.post<Comment>("/comments", { taskId, content });
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  await api.delete(`/comments/${commentId}`);
};