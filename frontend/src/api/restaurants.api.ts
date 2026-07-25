import { apiClient } from '@lib/api-client';
import type { OpeningHours, Restaurant } from '@models/index';

export interface RestaurantWriteInput {
  name?: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  galleryImages?: string[];
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  currency?: string;
  taxRate?: number;
  openingHours?: OpeningHours;
  hasParking?: boolean;
  hasWifi?: boolean;
  isWheelchairAccessible?: boolean;
  isPetFriendly?: boolean;
  acceptsCardPayment?: boolean;
}

export async function getPublicRestaurant(slug: string) {
  const { data } = await apiClient.get<Restaurant>(`/restaurants/public/${slug}`);
  return data;
}

export async function getMyRestaurant() {
  const { data } = await apiClient.get<Restaurant>('/restaurants/me');
  return data;
}

export async function updateRestaurant(id: string, input: RestaurantWriteInput) {
  const { data } = await apiClient.patch<Restaurant>(`/restaurants/${id}`, input);
  return data;
}

export async function getAllRestaurants() {
  const { data } = await apiClient.get<Restaurant[]>('/restaurants');
  return data;
}

export async function createRestaurant(input: {
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
}) {
  const { data } = await apiClient.post('/restaurants', input);
  return data;
}

export async function setRestaurantActive(id: string, isActive: boolean) {
  const { data } = await apiClient.patch<Restaurant>(`/restaurants/${id}/active`, { isActive });
  return data;
}

export async function deleteRestaurant(id: string) {
  await apiClient.delete(`/restaurants/${id}`);
}
