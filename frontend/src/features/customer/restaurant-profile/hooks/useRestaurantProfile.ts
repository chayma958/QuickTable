import { getPublicMenu } from '@api/menu.api';
import { getPublicReviews, getPublicReviewSummary } from '@api/reviews.api';
import { useQuery } from '@tanstack/react-query';

export const DEMO_RESTAURANT_SLUG = 'bella-italia';

export function useRestaurantProfile(slug: string) {
  const menuQuery = useQuery({
    queryKey: ['public-menu', slug],
    queryFn: () => getPublicMenu(slug),
    enabled: !!slug,
  });

  const ratingQuery = useQuery({
    queryKey: ['public-review-summary', slug],
    queryFn: () => getPublicReviewSummary(slug),
    enabled: !!slug,
  });

  const reviewsQuery = useQuery({
    queryKey: ['public-reviews', slug],
    queryFn: () => getPublicReviews(slug),
    enabled: !!slug,
  });

  return {
    isLoading: menuQuery.isLoading,
    isError: menuQuery.isError || !menuQuery.data,
    restaurant: menuQuery.data?.restaurant,
    categories: menuQuery.data?.categories ?? [],
    rating: ratingQuery.data
      ? { average: ratingQuery.data.averageRating, count: ratingQuery.data.totalReviews }
      : null,
    reviews: reviewsQuery.data ?? [],
  };
}
