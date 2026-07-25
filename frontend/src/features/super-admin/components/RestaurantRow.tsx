import type { Restaurant } from '@models/index';

export function RestaurantRow({
  restaurant,
  onToggleActive,
  onDelete,
}: {
  restaurant: Restaurant;
  onToggleActive: (isActive: boolean) => void;
  onDelete: () => void;
}) {
  return (
    <div className="mb-2.5 flex items-center gap-4 rounded-xl border border-border bg-bg p-3.5">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-text">{restaurant.name}</div>
        <div className="text-xs text-text-muted">/{restaurant.slug}</div>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-bold ${
          restaurant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {restaurant.isActive ? 'Active' : 'Inactive'}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onToggleActive(!restaurant.isActive)}
          className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg-subtle"
        >
          {restaurant.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-danger px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/10"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
