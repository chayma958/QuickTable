import type { Category } from '@models/index';
import { motion } from 'framer-motion';

export function CategoryTabs({
  categories,
  activeId,
  onSelect,
}: {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const items: Array<{ id: string | null; label: string }> = [
    { id: null, label: 'All' },
    ...categories.map((c) => ({ id: c.id, label: c.name })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto px-5 py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id ?? 'all'}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive ? 'text-white' : 'border border-border bg-surface text-text-muted hover:text-text'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill-active"
                transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                className="absolute inset-0 rounded-full bg-brand"
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
