import { resetPassword } from '@api/auth.api';
import { formStyles as f } from '@components/ui/formStyles';
import { AuthLayout } from '@layouts/AuthLayout/AuthLayout';
import { useToast } from '@store/toast-context';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function ResetPasswordPage() {
  const { token = '' } = useParams<{ token: string }>();
  const toast = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => resetPassword(token, password),
    onSuccess: () => {
      toast.success('Password updated — please sign in.');
      navigate('/login', { replace: true });
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'This reset link is invalid or has expired';
      setError(Array.isArray(message) ? message.join(', ') : message);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    mutation.mutate();
  }

  return (
    <AuthLayout>
      <p className="mb-6 text-sm text-text-muted">Choose a new password for your account.</p>
      <form className={f.form} onSubmit={handleSubmit}>
        <div className={f.field}>
          <label className={f.label} htmlFor="password">
            New password
          </label>
          <input
            id="password"
            type="password"
            className={f.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={f.field}>
          <label className={f.label} htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={f.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <span className={`${f.error} text-center`}>{error}</span>}
        <button type="submit" className={`${f.primaryButton} mt-1 w-full`} disabled={mutation.isPending}>
          {mutation.isPending ? 'Updating...' : 'Reset password'}
        </button>
      </form>
    </AuthLayout>
  );
}
