import { apiClient } from '@lib/api-client';
import type { RestaurantTable, TableOverview, TableRequest, TableRequestType } from '@models/index';

export async function getPublicTableByNumber(slug: string, number: number) {
  const { data } = await apiClient.get<{ id: string; number: number }>(
    `/tables/public/${slug}/${number}`,
  );
  return data;
}

export async function createTableRequest(tableId: string, type: TableRequestType) {
  const { data } = await apiClient.post<TableRequest>(`/tables/public/${tableId}/requests`, { type });
  return data;
}

export async function getTables(restaurantId: string) {
  const { data } = await apiClient.get<RestaurantTable[]>(`/restaurants/${restaurantId}/tables`);
  return data;
}

export async function getTablesOverview(restaurantId: string) {
  const { data } = await apiClient.get<TableOverview[]>(`/restaurants/${restaurantId}/tables/overview`);
  return data;
}

export async function createTable(restaurantId: string, number: number) {
  const { data } = await apiClient.post<RestaurantTable>(`/restaurants/${restaurantId}/tables`, {
    number,
  });
  return data;
}

export async function setTableActive(restaurantId: string, id: string, isActive: boolean) {
  const { data } = await apiClient.patch<RestaurantTable>(
    `/restaurants/${restaurantId}/tables/${id}`,
    { isActive },
  );
  return data;
}

export async function assignTableWaiter(restaurantId: string, id: string, waiterId: string | null) {
  const { data } = await apiClient.patch<RestaurantTable>(
    `/restaurants/${restaurantId}/tables/${id}/assign`,
    { waiterId },
  );
  return data;
}

export async function closeTable(restaurantId: string, id: string) {
  const { data } = await apiClient.patch<RestaurantTable>(
    `/restaurants/${restaurantId}/tables/${id}/close`,
    {},
  );
  return data;
}

export async function resolveTableRequest(restaurantId: string, tableId: string, requestId: string) {
  const { data } = await apiClient.patch<TableRequest>(
    `/restaurants/${restaurantId}/tables/${tableId}/requests/${requestId}/resolve`,
    {},
  );
  return data;
}

export async function deleteTable(restaurantId: string, id: string) {
  await apiClient.delete(`/restaurants/${restaurantId}/tables/${id}`);
}
