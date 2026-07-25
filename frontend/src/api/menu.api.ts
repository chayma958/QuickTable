import { apiClient } from '@lib/api-client';
import type { Category, MenuItem, Restaurant } from '@models/index';

export interface MenuItemWriteInput {
  categoryId?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  discountPrice?: number;
  isAvailable?: boolean;
  preparationTimeMinutes?: number;
  calories?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
}

export async function getPublicMenu(slug: string) {
  const { data } = await apiClient.get<{ restaurant: Restaurant; categories: Category[] }>(
    `/menu/public/${slug}`,
  );
  return data;
}

export async function getCategories(restaurantId: string) {
  const { data } = await apiClient.get<Category[]>(`/restaurants/${restaurantId}/categories`);
  return data;
}

export async function createCategory(restaurantId: string, input: Partial<Category>) {
  const { data } = await apiClient.post<Category>(
    `/restaurants/${restaurantId}/categories`,
    input,
  );
  return data;
}

export async function updateCategory(
  restaurantId: string,
  id: string,
  input: Partial<Category>,
) {
  const { data } = await apiClient.patch<Category>(
    `/restaurants/${restaurantId}/categories/${id}`,
    input,
  );
  return data;
}

export async function deleteCategory(restaurantId: string, id: string) {
  await apiClient.delete(`/restaurants/${restaurantId}/categories/${id}`);
}

export async function reorderCategories(
  restaurantId: string,
  items: { id: string; sortOrder: number }[],
) {
  const { data } = await apiClient.patch<Category[]>(
    `/restaurants/${restaurantId}/categories/reorder`,
    { items },
  );
  return data;
}

export async function getMenuItems(restaurantId: string) {
  const { data } = await apiClient.get<MenuItem[]>(`/restaurants/${restaurantId}/menu-items`);
  return data;
}

export async function createMenuItem(restaurantId: string, input: MenuItemWriteInput) {
  const { data } = await apiClient.post<MenuItem>(
    `/restaurants/${restaurantId}/menu-items`,
    input,
  );
  return data;
}

export async function updateMenuItem(
  restaurantId: string,
  id: string,
  input: MenuItemWriteInput,
) {
  const { data } = await apiClient.patch<MenuItem>(
    `/restaurants/${restaurantId}/menu-items/${id}`,
    input,
  );
  return data;
}

export async function setMenuItemAvailability(
  restaurantId: string,
  id: string,
  isAvailable: boolean,
) {
  const { data } = await apiClient.patch<MenuItem>(
    `/restaurants/${restaurantId}/menu-items/${id}/availability`,
    { isAvailable },
  );
  return data;
}

export async function deleteMenuItem(restaurantId: string, id: string) {
  await apiClient.delete(`/restaurants/${restaurantId}/menu-items/${id}`);
}
