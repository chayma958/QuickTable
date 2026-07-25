import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChefHat, Smartphone, UtensilsCrossed } from 'lucide-react';
import { useEffect, useState } from 'react';

const ROWS = [
  { icon: Smartphone, label: 'Customer' },
  { icon: ChefHat, label: 'Kitchen' },
  { icon: Bell, label: 'Waiter' },
  { icon: UtensilsCrossed, label: 'Table 4' },
] as const;

const FRAMES = [
  { row: 0, status: '🍕 Order #124 created' },
  { row: 1, status: 'Incoming (1)' },
  { row: 1, status: 'Preparing' },
  { row: 1, status: 'Ready' },
  { row: 2, status: '🔔 Table 4 ready' },
  { row: 3, status: 'Occupied' },
] as const;

const FRAME_DURATION_MS = 1400;

export function LiveOrderSimulation() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrameIndex((f) => (f + 1) % FRAMES.length);
    }, FRAME_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  const currentRow = FRAMES[frameIndex].row;

  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-border/60 bg-surface p-5 shadow-elevated">
      <div className="mb-4 flex items-center gap-2 px-1">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ml-2 text-xs font-medium text-text-muted">Live order</span>
      </div>

      <div className="flex flex-col gap-2">
        {ROWS.map((rowMeta, i) => {
          const isActive = i === currentRow;
          const isDone = i < currentRow;
          const lastFrameForRow = [...FRAMES].reverse().find((f) => f.row === i);
          const status = isActive ? FRAMES[frameIndex].status : lastFrameForRow?.status;
          const Icon = rowMeta.icon;
          return (
            <motion.div
              key={rowMeta.label}
              animate={{
                backgroundColor: isActive ? 'var(--color-brand-light)' : 'transparent',
                scale: isActive ? 1.02 : 1,
              }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isActive || isDone ? 'bg-brand text-white' : 'bg-bg-subtle text-text-muted'
                }`}
              >
                <Icon size={16} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-xs font-semibold text-text-muted">{rowMeta.label}</span>
                <AnimatePresence mode="wait">
                  {(isActive || isDone) && (
                    <motion.span
                      key={status}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="truncate text-sm font-medium text-text"
                    >
                      {status}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {isActive && (
                <motion.span
                  className="h-2 w-2 shrink-0 rounded-full bg-brand"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
