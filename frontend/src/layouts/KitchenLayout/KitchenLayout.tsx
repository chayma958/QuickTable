import { AccountSettingsModal } from '@components/ui/AccountSettingsModal';
import { Avatar } from '@components/ui/Avatar';
import { useAuth } from '@store/auth-context';
import { Settings } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export function KitchenLayout({ title, children }: { title: string; children: ReactNode }) {
  const { actor, logout } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const [showAccount, setShowAccount] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <span className="text-xl font-bold">{title}</span>
        <span className="text-2xl font-bold tabular-nums">
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAccount(true)}
            aria-label="Account settings"
            title="Account settings"
            className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-transparent px-4.5 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.08]"
          >
            <Avatar
              name={actor?.type === 'staff' ? actor.name : '?'}
              src={actor?.type === 'staff' ? actor.avatarUrl : null}
              size={26}
            />
            {actor?.type === 'staff' ? actor.name : 'Account'}
            <Settings size={15} className="text-white/70" />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-white/20 bg-transparent px-4.5 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.08]"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">{children}</main>

      {showAccount && <AccountSettingsModal onClose={() => setShowAccount(false)} />}
    </div>
  );
}
