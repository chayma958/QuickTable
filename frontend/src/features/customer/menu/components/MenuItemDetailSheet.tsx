import type { MenuItem } from '@models/index';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export function MenuItemDetailSheet({
  item,
  onClose,
  onAdd,
}: {
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (item: MenuItem, quantity: number, notes?: string) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!item) return null;

  function handleAdd() {
    onAdd(item!, quantity, notes.trim() || undefined);
    setQuantity(1);
    setNotes('');
    onClose();
  }

  const unitPrice = Number(item.discountPrice ?? item.price);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 sm:items-center"
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[88vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-2xl bg-surface p-6 sm:rounded-2xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mb-3 self-end text-text-muted"
          >
            <X size={20} />
          </button>
          {item.imageUrl && (
            <img src={item.imageUrl} alt="" className="h-48 w-full rounded-xl bg-bg-subtle object-cover" />
          )}
          <span className="text-xl font-bold text-text">{item.name}</span>
          {item.description && <span className="text-sm text-text-muted">{item.description}</span>}
          <div className="flex gap-4 text-sm text-text-muted">
            <span>{item.preparationTimeMinutes} min prep</span>
            {item.calories && <span>{item.calories} cal</span>}
          </div>
          <span className="text-lg font-bold text-text">${unitPrice.toFixed(2)}</span>

          <label className="text-sm font-semibold text-text" htmlFor="item-notes">
            Special instructions
          </label>
          <textarea
            id="item-notes"
            rows={2}
            placeholder="e.g. no onions"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-light"
          />

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-text hover:bg-bg-subtle"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center font-semibold text-text">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center text-text hover:bg-bg-subtle"
              >
                <Plus size={15} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 rounded-xl bg-brand py-3 text-[0.9375rem] font-bold text-white hover:bg-brand-dark"
            >
              Add to cart · ${(unitPrice * quantity).toFixed(2)}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
