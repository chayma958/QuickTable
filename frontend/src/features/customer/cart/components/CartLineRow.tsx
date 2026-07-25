import type { CartLine } from '@models/index';
import { Minus, Plus } from 'lucide-react';

export function CartLineRow({
  line,
  onQuantityChange,
  onRemove,
}: {
  line: CartLine;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  const unitPrice = Number(line.menuItem.discountPrice ?? line.menuItem.price);

  return (
    <div className="flex gap-3.5 border-b border-border py-3.5 last:border-none">
      {line.menuItem.imageUrl && (
        <img src={line.menuItem.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm font-semibold text-text">{line.menuItem.name}</span>
        {line.notes && <span className="text-xs italic text-text-muted">"{line.notes}"</span>}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-border">
            <button
              type="button"
              onClick={() => onQuantityChange(line.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center text-text hover:bg-bg-subtle"
            >
              <Minus size={13} />
            </button>
            <span className="w-7 text-center text-sm font-semibold text-text">{line.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(line.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center text-text hover:bg-bg-subtle"
            >
              <Plus size={13} />
            </button>
          </div>
          <span className="text-sm font-bold text-text">${(unitPrice * line.quantity).toFixed(2)}</span>
        </div>
      </div>
      <button type="button" onClick={onRemove} className="self-start text-xs font-semibold text-danger">
        Remove
      </button>
    </div>
  );
}
