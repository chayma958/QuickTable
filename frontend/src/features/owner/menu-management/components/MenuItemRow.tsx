import type { MenuItem } from '@models/index';

export function MenuItemRow({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}: {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: (isAvailable: boolean) => void;
}) {
  return (
    <div className="mb-2.5 flex items-center gap-4 rounded-xl border border-border bg-bg p-3.5">
      {item.imageUrl && (
        <img src={item.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-lg bg-bg-subtle object-cover" />
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-text">{item.name}</div>
        <div className="text-xs text-text-muted">{item.category?.name}</div>
      </div>
      <span className="flex w-24 flex-col items-end text-right">
        <span className="text-sm font-bold text-text">
          ${Number(item.discountPrice ?? item.price).toFixed(2)}
        </span>
        {item.discountPrice != null && (
          <span className="text-xs text-text-muted line-through">${Number(item.price).toFixed(2)}</span>
        )}
      </span>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs text-text-muted">
          <input
            type="checkbox"
            checked={item.isAvailable}
            onChange={(e) => onToggleAvailability(e.target.checked)}
          />
          Available
        </label>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg-subtle"
        >
          Edit
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
