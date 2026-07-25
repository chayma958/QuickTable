import { AccountSettingsModal } from '@components/ui/AccountSettingsModal';
import { Avatar } from '@components/ui/Avatar';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { useAuth } from '@store/auth-context';
import { Menu, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { actor, logout } = useAuth();
  const navigate = useNavigate();
  const [showAccount, setShowAccount] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const name = actor?.type === 'staff' ? actor.name : '';
  const role = actor?.type === 'staff' ? actor.role.replace('_', ' ') : '';

  return (
    <header className="flex items-center justify-between border-b border-border bg-bg px-6 py-3.5">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="-ml-2 flex h-9 w-9 items-center justify-center rounded-lg text-text hover:bg-bg-subtle md:hidden"
      >
        <Menu size={20} />
      </button>
      <div className="hidden md:block" />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setShowAccount(true)}
          aria-label="Account settings"
          title="Account settings"
          className="flex items-center gap-2 hover:opacity-75"
        >
          <div className="flex flex-col items-end leading-tight">
            <span className="text-sm font-semibold text-text">{name}</span>
            <span className="text-xs capitalize text-text-muted">{role}</span>
          </div>
          <Avatar name={name || '?'} src={actor?.type === 'staff' ? actor.avatarUrl : null} size={32} />
          <Settings size={16} className="text-text-muted" />
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-border bg-bg px-3.5 py-2 text-[0.8125rem] font-medium text-text hover:bg-bg-subtle"
        >
          Log out
        </button>
      </div>

      {showAccount && <AccountSettingsModal onClose={() => setShowAccount(false)} />}
    </header>
  );
}
