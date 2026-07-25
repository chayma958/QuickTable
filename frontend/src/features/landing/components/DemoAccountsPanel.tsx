import { LayoutDashboard, ChefHat, ShieldCheck, Users, type LucideIcon } from 'lucide-react';

export interface DemoAccount {
  role: string;
  email: string;
  password: string;
  icon: LucideIcon;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: 'Restaurant Owner', email: 'owner@demo.com', password: 'demo123', icon: LayoutDashboard },
  { role: 'Kitchen', email: 'kitchen@demo.com', password: 'demo123', icon: ChefHat },
  { role: 'Waiter', email: 'waiter@demo.com', password: 'demo123', icon: Users },
  { role: 'Platform Admin', email: 'admin@demo.com', password: 'demo123', icon: ShieldCheck },
];

export function DemoAccountsPanel({
  pendingEmail,
  onUseAccount,
}: {
  pendingEmail: string | null;
  onUseAccount: (email: string, password: string) => void;
}) {
  return (
    <div className="mt-8 border-t border-border pt-6">
      <h2 className="mb-1 text-sm font-semibold text-text">Demo accounts</h2>
      <p className="mb-4 text-xs text-text-muted">
        No real account? Sign in instantly as any role — same login endpoint, real JWTs.
      </p>
      <div className="flex flex-col gap-2.5">
        {DEMO_ACCOUNTS.map((acc) => (
          <div
            key={acc.email}
            className="flex items-center gap-3 rounded-xl border border-border bg-bg-subtle p-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand-dark">
              <acc.icon size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-text">{acc.role}</div>
              <div className="truncate text-xs text-text-muted">{acc.email}</div>
            </div>
            <button
              type="button"
              disabled={pendingEmail !== null}
              onClick={() => onUseAccount(acc.email, acc.password)}
              className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pendingEmail === acc.email ? 'Signing in...' : 'Use Demo Account'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
