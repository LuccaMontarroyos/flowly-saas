import { api } from "@/lib/api";

export async function getInviteDetails(inviteToken: string) {
  const response = await api.get(`/invites/${inviteToken}`);
  return response.data;
}

export async function createInvite(email?: string) {
  const response = await api.post("/invites", {
    role: "MEMBER",
    email: email || undefined,
  });

  return response.data;
}

