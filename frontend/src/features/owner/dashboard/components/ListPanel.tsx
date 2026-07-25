import type { ReactNode } from 'react';

export function ListPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-bg p-5">
      <div className="mb-3.5 text-[0.9375rem] font-bold text-text">{title}</div>
      {children}
    </div>
  );
}

export function ListRow({ primary, meta }: { primary: ReactNode; meta: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-bg-subtle py-2 text-[0.8125rem] last:border-b-0">
      <span className="font-semibold text-text">{primary}</span>
      <span className="text-text-muted">{meta}</span>
    </div>
  );
}

export function ListEmpty({ children }: { children: ReactNode }) {
  return <div className="py-2 text-[0.8125rem] text-text-muted">{children}</div>;
}
