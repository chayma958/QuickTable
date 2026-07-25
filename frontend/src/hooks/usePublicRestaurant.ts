import { getPublicRestaurant } from '@api/restaurants.api';
import { getPublicReviewSummary } from '@api/reviews.api';
import { useQuery } from '@tanstack/react-query';

export function usePublicRestaurant(slug: string | null) {
  return useQuery({
    queryKey: ['public-restaurant', slug],
    queryFn: () => getPublicRestaurant(slug!),
    enabled: !!slug,
  });
}

export function useCustomerHeaderInfo(slug: string | null) {
  const restaurantQuery = usePublicRestaurant(slug);
  const ratingQuery = useQuery({
    queryKey: ['public-review-summary', slug],
    queryFn: () => getPublicReviewSummary(slug!),
    enabled: !!slug,
  });

  return {
    restaurant: restaurantQuery.data,
    rating: ratingQuery.data
      ? { average: ratingQuery.data.averageRating, count: ratingQuery.data.totalReviews }
      : null,
  };
}
