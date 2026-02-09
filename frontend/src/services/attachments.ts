import { api } from "@/lib/api";

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

export const getTaskAttachments = async (taskId: string) => {
  const response = await api.get<Attachment[]>(`/attachments/task/${taskId}`);
  return response.data;
};

export const createAttachment = async (data: { taskId: string; name: string; url: string; type: string; size: number }) => {
  const response = await api.post<Attachment>("/attachments", data);
  return response.data;
};

export const deleteAttachment = async (attachmentId: string) => {
  await api.delete(`/attachments/${attachmentId}`);
};