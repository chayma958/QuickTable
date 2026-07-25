import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-1.5 px-6 py-14 text-center ${className}`}>
      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand-dark">
        <Icon size={24} strokeWidth={1.75} />
      </div>
      <div className="text-base font-semibold text-text">{title}</div>
      {description && <p className="max-w-xs text-sm text-text-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
