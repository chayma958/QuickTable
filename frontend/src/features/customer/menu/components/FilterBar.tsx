import { Search } from 'lucide-react';
import type { DietaryFilter } from '../hooks/useMenuPageData';

const FILTERS: { key: DietaryFilter; label: string }[] = [
  { key: 'isVegetarian', label: 'Vegetarian' },
  { key: 'isVegan', label: 'Vegan' },
  { key: 'isGlutenFree', label: 'Gluten-free' },
  { key: 'isSpicy', label: 'Spicy' },
];

export function FilterBar({
  search,
  onSearchChange,
  activeFilters,
  onToggleFilter,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilters: DietaryFilter[];
  onToggleFilter: (filter: DietaryFilter) => void;
}) {
  return (
    <div className="flex flex-col gap-3 px-5 pb-4">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-border bg-surface py-3.5 pl-11 pr-4 text-[0.9375rem] text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-light"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => onToggleFilter(filter.key)}
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeFilters.includes(filter.key)
                ? 'bg-text text-bg'
                : 'border border-border bg-surface text-text-muted'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
