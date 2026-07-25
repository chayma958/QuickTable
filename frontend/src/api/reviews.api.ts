import { apiClient } from '@lib/api-client';

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer: { name: string | null };
  order: { orderNumber: number };
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}

export async function createReview(orderId: string, rating: number, comment?: string) {
  const { data } = await apiClient.post(`/orders/${orderId}/reviews`, { rating, comment });
  return data;
}

export async function getReviews(restaurantId: string) {
  const { data } = await apiClient.get<Review[]>(`/restaurants/${restaurantId}/reviews`);
  return data;
}

export async function getReviewSummary(restaurantId: string) {
  const { data } = await apiClient.get<ReviewSummary>(
    `/restaurants/${restaurantId}/reviews/summary`,
  );
  return data;
}

export async function getPublicReviewSummary(slug: string) {
  const { data } = await apiClient.get<ReviewSummary>(`/reviews/public/${slug}/summary`);
  return data;
}

export interface PublicReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer: { name: string | null };
}

export async function getPublicReviews(slug: string) {
  const { data } = await apiClient.get<PublicReview[]>(`/reviews/public/${slug}`);
  return data;
}
