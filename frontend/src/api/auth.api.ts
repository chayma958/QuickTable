import { apiClient } from '@lib/api-client';
import type { StaffUser } from '@models/index';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export async function staffLogin(email: string, password: string) {
  const { data } = await apiClient.post<TokenPair & { user: Omit<StaffUser, 'type'> }>(
    '/auth/staff/login',
    { email, password },
  );
  return { ...data, actor: { ...data.user, type: 'staff' as const } };
}

export async function logout(refreshToken: string) {
  await apiClient.post('/auth/logout', { refreshToken });
}

export async function forgotPassword(email: string) {
  const { data } = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(token: string, password: string) {
  const { data } = await apiClient.post<{ message: string }>('/auth/reset-password', {
    token,
    password,
  });
  return data;
}

export async function updateMyProfile(input: { name?: string; email?: string; avatarUrl?: string }) {
  const { data } = await apiClient.patch<Omit<StaffUser, 'type'>>('/auth/me', input);
  return data;
}

export async function changeMyPassword(currentPassword: string, newPassword: string) {
  const { data } = await apiClient.patch<{ message: string }>('/auth/me/password', {
    currentPassword,
    newPassword,
  });
  return data;
}
