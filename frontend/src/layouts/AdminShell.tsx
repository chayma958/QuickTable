import { AccountSettingsModal } from '@components/ui/AccountSettingsModal';
import { Avatar } from '@components/ui/Avatar';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { useAuth } from '@store/auth-context';
import { Settings, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AdminShell({ children }: { children: ReactNode }) {
  const { actor, logout } = useAuth();
  const navigate = useNavigate();
  const [showAccount, setShowAccount] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const name = actor?.type === 'staff' ? actor.name : '';

  return (
    <div className="min-h-screen bg-bg-subtle">
      <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <ShieldCheck size={16} />
          </span>
          <span className="text-[0.9375rem] font-bold text-text">QuickTable Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setShowAccount(true)}
            aria-label="Account settings"
            title="Account settings"
            className="flex items-center gap-1.5 text-sm font-semibold text-text hover:opacity-75"
          >
            <Avatar name={name || '?'} src={actor?.type === 'staff' ? actor.avatarUrl : null} size={28} />
            {name}
            <Settings size={15} className="text-text-muted" />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-border bg-bg px-3.5 py-2 text-[0.8125rem] font-medium text-text hover:bg-bg-subtle"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="p-6">{children}</main>

      {showAccount && <AccountSettingsModal onClose={() => setShowAccount(false)} />}
    </div>
  );
}
