import { formStyles as f } from '@components/ui/formStyles';
import { DemoAccountsPanel } from '@features/landing/components/DemoAccountsPanel';
import { AuthLayout } from '@layouts/AuthLayout/AuthLayout';
import { useAuth } from '@store/auth-context';
import type { Role } from '@models/index';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ROLE_HOME: Record<Role, string> = {
  SUPER_ADMIN: '/admin',
  OWNER: '/dashboard',
  KITCHEN: '/kitchen',
  WAITER: '/waiter',
};

export function StaffLoginPage() {
  const { loginStaff } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  async function performLogin(loginEmail: string, loginPassword: string) {
    setError(null);
    setPendingEmail(loginEmail);
    try {
      const staff = await loginStaff(loginEmail, loginPassword);
      navigate(ROLE_HOME[staff.role], { replace: true });
    } catch {
      setError('Invalid email or password');
    } finally {
      setPendingEmail(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    performLogin(email, password);
  }

  return (
    <AuthLayout>
      <p className="mb-6 text-sm text-text-muted">
        Staff sign-in — restaurant owners, kitchen &amp; waiters.
        <br />
        Ordering food? Scan the QR code on your table instead.
      </p>
      <form className={f.form} onSubmit={handleSubmit}>
        <div className={f.field}>
          <label className={f.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={f.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={f.field}>
          <div className="flex items-center justify-between">
            <label className={f.label} htmlFor="password">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-semibold text-brand hover:text-brand-dark">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            className={f.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <span className={`${f.error} text-center`}>{error}</span>}
        <button type="submit" className={`${f.primaryButton} mt-1 w-full`} disabled={pendingEmail !== null}>
          {pendingEmail === email ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <DemoAccountsPanel pendingEmail={pendingEmail} onUseAccount={performLogin} />
    </AuthLayout>
  );
}
