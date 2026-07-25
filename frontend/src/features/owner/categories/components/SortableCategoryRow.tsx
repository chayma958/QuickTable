import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Category } from '@models/index';
import { GripVertical } from 'lucide-react';

export function SortableCategoryRow({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="mb-2.5 flex items-center gap-3.5 rounded-xl border border-border bg-bg px-4 py-3.5"
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab select-none text-text-muted active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </span>
      <div className="flex-1">
        <div className="text-sm font-semibold text-text">{category.name}</div>
        <div className="text-xs text-text-muted">{category._count?.menuItems ?? 0} items</div>
      </div>
      <div className="flex gap-2">
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
