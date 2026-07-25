import { forgotPassword } from '@api/auth.api';
import { formStyles as f } from '@components/ui/formStyles';
import { AuthLayout } from '@layouts/AuthLayout/AuthLayout';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: () => forgotPassword(email),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  if (mutation.isSuccess) {
    return (
      <AuthLayout>
        <p className="mb-2 text-sm font-semibold text-text">Check your email</p>
        <p className="mb-6 text-sm text-text-muted">
          If an account exists for <strong className="text-text">{email}</strong>, we&apos;ve sent a
          link to reset your password. It expires in 1 hour.
        </p>
        <Link to="/login" className="text-sm font-semibold text-brand hover:text-brand-dark">
          Back to sign in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <p className="mb-6 text-sm text-text-muted">
        Enter the email on your staff account and we&apos;ll send you a link to reset your password.
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
        <button type="submit" className={`${f.primaryButton} mt-1 w-full`} disabled={mutation.isPending}>
          {mutation.isPending ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
      <Link to="/login" className="mt-5 block text-center text-sm font-semibold text-brand hover:text-brand-dark">
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
