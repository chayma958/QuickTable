import type { LucideIcon } from 'lucide-react';

export function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg p-5">
      <div className="flex items-center justify-between">
        <div className="text-[0.8125rem] font-semibold text-text-muted">{label}</div>
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-brand-dark">
            <Icon size={15} />
          </span>
        )}
      </div>
      <div className="mt-1.5 text-[1.625rem] font-bold text-text">{value}</div>
    </div>
  );
}
