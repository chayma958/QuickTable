import { apiClient } from '@lib/api-client';
import type { CouponType } from '@models/index';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: string;
  minOrderAmount: string | null;
  maxUsageCount: number | null;
  usageCount: number;
  maxUsagePerCustomer: number | null;
  expiresAt: string | null;
  isActive: boolean;
}

export interface CreateCouponInput {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxUsageCount?: number;
  maxUsagePerCustomer?: number;
  expiresAt?: string;
}

export async function getCoupons(restaurantId: string) {
  const { data } = await apiClient.get<Coupon[]>(`/restaurants/${restaurantId}/coupons`);
  return data;
}

export async function createCoupon(restaurantId: string, input: CreateCouponInput) {
  const { data } = await apiClient.post<Coupon>(`/restaurants/${restaurantId}/coupons`, input);
  return data;
}

export async function setCouponActive(restaurantId: string, id: string, isActive: boolean) {
  const { data } = await apiClient.patch<Coupon>(`/restaurants/${restaurantId}/coupons/${id}`, {
    isActive,
  });
  return data;
}

export async function deleteCoupon(restaurantId: string, id: string) {
  await apiClient.delete(`/restaurants/${restaurantId}/coupons/${id}`);
}
