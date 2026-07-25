import { ThemeToggle } from '@components/ui/ThemeToggle';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-dark to-brand p-6">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[440px] rounded-2xl bg-surface p-10 py-10 shadow-elevated">
        <Link to="/" className="mb-8 flex items-center gap-2.5 hover:opacity-80">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-[0.8125rem] font-bold text-white">
            QT
          </span>
          <span className="text-lg font-bold text-text">QuickTable</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
