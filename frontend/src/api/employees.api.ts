import { apiClient } from '@lib/api-client';
import type { Employee } from '@models/index';

export async function getEmployees(restaurantId: string) {
  const { data } = await apiClient.get<Employee[]>(`/restaurants/${restaurantId}/employees`);
  return data;
}

export async function updateEmployee(
  restaurantId: string,
  id: string,
  input: Partial<Pick<Employee, 'name' | 'phone' | 'role' | 'isActive'>>,
) {
  const { data } = await apiClient.patch<Employee>(
    `/restaurants/${restaurantId}/employees/${id}`,
    input,
  );
  return data;
}

export async function deleteEmployee(restaurantId: string, id: string) {
  await apiClient.delete(`/restaurants/${restaurantId}/employees/${id}`);
}
