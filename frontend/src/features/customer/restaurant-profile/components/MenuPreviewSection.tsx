import type { Category } from '@models/index';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const DIET_LABELS: Record<string, string> = {
  isVegetarian: 'Vegetarian',
  isVegan: 'Vegan',
  isGlutenFree: 'Gluten-Free',
  isSpicy: 'Spicy',
};

export function MenuPreviewSection({ categories }: { categories: Category[] }) {
  const previewItems = categories.flatMap((c) =>
    (c.menuItems ?? []).map((item) => ({ item, categoryName: c.name })),
  ).slice(0, 6);

  if (previewItems.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {previewItems.map(({ item, categoryName }) => {
        const badges = Object.entries(DIET_LABELS).filter(([key]) => item[key as keyof typeof item]);

        return (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            className="group overflow-hidden rounded-2xl bg-surface shadow-soft transition-shadow duration-300 hover:shadow-elevated"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                {categoryName}
              </span>
              {badges.length > 0 && (
                <div className="absolute right-2.5 top-2.5 flex flex-col items-end gap-1">
                  {badges.slice(0, 2).map(([key]) => (
                    <span
                      key={key}
                      className="rounded-full bg-white/90 px-2 py-0.5 text-[0.625rem] font-bold text-text"
                    >
                      {DIET_LABELS[key]}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="mb-1">
                <span className="text-[0.9375rem] font-bold text-text">{item.name}</span>
              </div>
              {item.description && (
                <p className="mb-3 line-clamp-2 text-sm text-text-muted">{item.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-text">
                  ${Number(item.discountPrice ?? item.price).toFixed(2)}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white transition-colors group-hover:bg-brand-dark">
                  <Plus size={16} />
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
