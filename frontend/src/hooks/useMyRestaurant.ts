import { getMyRestaurant } from '@api/restaurants.api';
import { useQuery } from '@tanstack/react-query';

export function useMyRestaurant() {
  return useQuery({
    queryKey: ['my-restaurant'],
    queryFn: getMyRestaurant,
    staleTime: 5 * 60_000,
  });
}
