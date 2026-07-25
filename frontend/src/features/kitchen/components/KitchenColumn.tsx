import type { ReactNode } from 'react';

export function KitchenColumn({
  title,
  count,
  children,
  isEmpty,
}: {
  title: string;
  count: number;
  children: ReactNode;
  isEmpty: boolean;
}) {
  return (
    <div className="flex h-full min-w-0 flex-col border-r border-white/[0.08] last:border-r-0">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
        <span className="text-[1.0625rem] font-extrabold uppercase tracking-wide text-white">{title}</span>
        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-brand px-2 text-sm font-extrabold text-white">
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {isEmpty ? <div className="py-8 text-center text-sm text-slate-500">No orders</div> : children}
      </div>
    </div>
  );
}
