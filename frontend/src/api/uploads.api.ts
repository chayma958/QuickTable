import { apiClient } from '@lib/api-client';

export async function uploadImage(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post<{ url: string }>(
    `/uploads/image?folder=${folder}`,
    formData,
  );
  return data.url;
}
