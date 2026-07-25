import { apiClient } from '@lib/api-client';
import type { Invitation, Role } from '@models/index';

export async function createInvitation(
  restaurantId: string,
  input: { name: string; email: string; role: Role },
) {
  const { data } = await apiClient.post<Invitation>(
    `/restaurants/${restaurantId}/invitations`,
    input,
  );
  return data;
}

export async function getInvitations(restaurantId: string) {
  const { data } = await apiClient.get<Invitation[]>(`/restaurants/${restaurantId}/invitations`);
  return data;
}

export async function revokeInvitation(restaurantId: string, id: string) {
  await apiClient.delete(`/restaurants/${restaurantId}/invitations/${id}`);
}

export interface InvitationDetails {
  email: string;
  name: string;
  role: Role;
  restaurantName: string;
}

export async function getInvitationByToken(token: string) {
  const { data } = await apiClient.get<InvitationDetails>(`/invitations/${token}`);
  return data;
}

export async function acceptInvitation(token: string, password: string) {
  const { data } = await apiClient.post(`/invitations/${token}/accept`, { password });
  return data;
}
