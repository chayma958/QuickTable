import type { ReactNode } from 'react';

const TONE_CLASS = {
  neutral: 'bg-bg-subtle text-text-muted',
  brand: 'bg-brand-light text-brand-dark',
  success: 'bg-[var(--color-status-ready-bg)] text-[var(--color-status-ready)]',
  warning: 'bg-[var(--color-status-pending-bg)] text-[var(--color-status-pending)]',
  danger: 'bg-[var(--color-status-cancelled-bg)] text-[var(--color-status-cancelled)]',
} as const;

export function Badge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: keyof typeof TONE_CLASS;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wide ${TONE_CLASS[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
