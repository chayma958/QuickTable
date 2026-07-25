import { EmptyState } from '@components/ui/EmptyState';
import { Skeleton } from '@components/ui/Skeleton';
import { CategoryTabs } from '@features/customer/menu/components/CategoryTabs';
import { FilterBar } from '@features/customer/menu/components/FilterBar';
import { MenuItemCard } from '@features/customer/menu/components/MenuItemCard';
import { MenuItemDetailSheet } from '@features/customer/menu/components/MenuItemDetailSheet';
import { useMenuPageData } from '@features/customer/menu/hooks/useMenuPageData';
import { CustomerLayout } from '@layouts/CustomerLayout/CustomerLayout';
import { SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MenuPage() {
  const menu = useMenuPageData();
  const navigate = useNavigate();

  if (menu.isLoading) {
    return (
      <CustomerLayout restaurantName="">
        <div className="mx-auto max-w-5xl">
          <div className="flex gap-2 overflow-x-auto px-5 py-3.5">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 px-5 pb-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-border bg-surface">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="p-4">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="mt-2 h-3 w-full" />
                  <Skeleton className="mt-1.5 h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (menu.isError || !menu.restaurant) {
    return (
      <CustomerLayout restaurantName="QuickTable">
        <div className="px-6 py-16 text-center text-sm text-text-muted">
          This restaurant could not be found.
        </div>
      </CustomerLayout>
    );
  }

  const { restaurant } = menu;

  return (
    <CustomerLayout
      restaurantName={restaurant.name}
      logoUrl={restaurant.logoUrl}
      tableId={menu.tableId}
      tableNumber={menu.tableNumber}
      rating={menu.rating}
      onCartIconClick={() => navigate('/cart')}
      restaurantProfileHref={`/r/${restaurant.slug}/about`}
      headerExtra={
        <div className="mx-auto w-full max-w-5xl">
          <CategoryTabs
            categories={menu.categories}
            activeId={menu.activeCategoryId}
            onSelect={menu.setActiveCategoryId}
          />
          <FilterBar
            search={menu.search}
            onSearchChange={menu.setSearch}
            activeFilters={menu.activeFilters}
            onToggleFilter={menu.toggleDietaryFilter}
          />
        </div>
      }
    >
      <div className="mx-auto max-w-5xl">
        {menu.visibleCategories.length === 0 ? (
          <div className="px-5">
            <EmptyState
              icon={SearchX}
              title="No dishes match your search"
              description="Try a different search term or clear your filters."
            />
          </div>
        ) : (
          menu.visibleCategories.map((category) => (
            <section key={category.id} className="px-5 pb-8">
              <h2 className="mb-4 text-xl font-bold text-text">{category.name}</h2>
              {category.description && (
                <p className="mb-4 -mt-3 text-sm text-text-muted">{category.description}</p>
              )}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {category.menuItems!.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onSelect={() => menu.setSelectedItem(item)}
                    onQuickAdd={() => menu.addItemToCart(item, 1)}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      <MenuItemDetailSheet
        item={menu.selectedItem}
        onClose={() => menu.setSelectedItem(null)}
        onAdd={menu.addItemToCart}
      />
    </CustomerLayout>
  );
}
