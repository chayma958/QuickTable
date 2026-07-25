import type { MenuItem } from '@models/index';
import { useToast } from '@store/toast-context';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const DIET_LABELS: Record<string, string> = {
  isVegetarian: 'Vegetarian',
  isVegan: 'Vegan',
  isGlutenFree: 'Gluten-Free',
  isSpicy: 'Spicy',
};

export function MenuItemCard({
  item,
  onSelect,
  onQuickAdd,
}: {
  item: MenuItem;
  onSelect: () => void;
  onQuickAdd: () => void;
}) {
  const toast = useToast();
  const badges = Object.entries(DIET_LABELS).filter(([key]) => item[key as keyof MenuItem]);
  const hasDiscount = item.discountPrice != null;

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    onQuickAdd();
    toast.success(`${item.name} added to cart`);
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      role="button"
      tabIndex={item.isAvailable ? 0 : -1}
      onClick={() => item.isAvailable && onSelect()}
      onKeyDown={(e) => {
        if (item.isAvailable && (e.key === 'Enter' || e.key === ' ')) onSelect();
      }}
      className={`group overflow-hidden rounded-2xl bg-surface shadow-soft transition-shadow duration-300 hover:shadow-elevated ${
        !item.isAvailable ? 'cursor-not-allowed opacity-55' : 'cursor-pointer'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-subtle">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        {badges.length > 0 && (
          <div className="absolute right-2.5 top-2.5 flex flex-col items-end gap-1">
            {badges.slice(0, 2).map(([key]) => (
              <span key={key} className="rounded-full bg-white/90 px-2 py-0.5 text-[0.625rem] font-bold text-text">
                {DIET_LABELS[key]}
              </span>
            ))}
          </div>
        )}
        {item.isAvailable && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Add ${item.name} to cart`}
            className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-elevated transition-transform hover:scale-105 hover:bg-brand-dark active:scale-95"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1">
          <span className="text-[0.9375rem] font-bold text-text">{item.name}</span>
        </div>
        {item.description && (
          <p className="mb-3 line-clamp-2 text-sm text-text-muted">{item.description}</p>
        )}
        {!item.isAvailable ? (
          <span className="text-[0.6875rem] font-bold uppercase text-danger">Currently unavailable</span>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-text">
              ${Number(item.discountPrice ?? item.price).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-text-muted line-through">${Number(item.price).toFixed(2)}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
