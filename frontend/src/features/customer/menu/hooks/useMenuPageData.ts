import { getPublicMenu } from '@api/menu.api';
import { getPublicReviewSummary } from '@api/reviews.api';
import { getPublicTableByNumber } from '@api/tables.api';
import { useCart } from '@store/cart-context';
import type { MenuItem } from '@models/index';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

export type DietaryFilter = 'isVegetarian' | 'isVegan' | 'isGlutenFree' | 'isSpicy';

export function useMenuPageData() {
  const { slug, tableNumber } = useParams<{ slug: string; tableNumber?: string }>();
  const cart = useCart();

  const menuQuery = useQuery({
    queryKey: ['public-menu', slug],
    queryFn: () => getPublicMenu(slug!),
    enabled: !!slug,
  });

  const tableQuery = useQuery({
    queryKey: ['public-table', slug, tableNumber],
    queryFn: () => getPublicTableByNumber(slug!, Number(tableNumber)),
    enabled: !!slug && !!tableNumber,
  });

  const ratingQuery = useQuery({
    queryKey: ['public-review-summary', slug],
    queryFn: () => getPublicReviewSummary(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    if (menuQuery.data && tableQuery.data) {
      cart.setDineInContext(
        menuQuery.data.restaurant.id,
        menuQuery.data.restaurant.slug,
        tableQuery.data.id,
        tableQuery.data.number,
      );
    }
  }, [menuQuery.data, tableQuery.data]);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<DietaryFilter[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  function toggleDietaryFilter(filter: DietaryFilter) {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter],
    );
  }

  const categories = menuQuery.data?.categories ?? [];

  const visibleCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return categories
      .filter((c) => !activeCategoryId || c.id === activeCategoryId)
      .map((c) => ({
        ...c,
        menuItems: (c.menuItems ?? []).filter((item) => {
          const matchesSearch = !query || item.name.toLowerCase().includes(query);
          const matchesFilters = activeFilters.every((f) => item[f as keyof MenuItem]);
          return matchesSearch && matchesFilters;
        }),
      }))
      .filter((c) => c.menuItems.length > 0);
  }, [categories, activeCategoryId, search, activeFilters]);

  return {
    isLoading: menuQuery.isLoading,
    isError: menuQuery.isError || !menuQuery.data,
    restaurant: menuQuery.data?.restaurant,
    tableId: tableQuery.data?.id,
    tableNumber: tableQuery.data?.number,
    rating: ratingQuery.data
      ? { average: ratingQuery.data.averageRating, count: ratingQuery.data.totalReviews }
      : null,
    categories,
    visibleCategories,
    activeCategoryId,
    setActiveCategoryId,
    search,
    setSearch,
    activeFilters,
    toggleDietaryFilter,
    selectedItem,
    setSelectedItem,
    addItemToCart: cart.addItem,
  };
}
