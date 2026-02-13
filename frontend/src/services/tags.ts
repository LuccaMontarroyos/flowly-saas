import { api } from "@/lib/api";
import { Tag } from "@/types";

export async function getTags(): Promise<Tag[]> {
  const response = await api.get("/tags");
  return response.data;
}

interface CreateTagPayload {
  name: string;
  color: string;
}

export async function createTag(payload: CreateTagPayload): Promise<Tag> {
  const response = await api.post("/tags", payload);
  return response.data;
}

export async function deleteTag(tagId: string): Promise<void> {
  await api.delete(`/tags/${tagId}`);
}

