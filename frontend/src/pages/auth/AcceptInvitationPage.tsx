import { formStyles as f } from '@components/ui/formStyles';
import { SkeletonText } from '@components/ui/Skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  acceptInvitationSchema,
  type AcceptInvitationFormValues,
} from '@features/auth/accept-invitation/accept-invitation.schema';
import { useAcceptInvitation } from '@features/auth/accept-invitation/useAcceptInvitation';
import { AuthLayout } from '@layouts/AuthLayout/AuthLayout';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

const ROLE_LABELS: Record<string, string> = {
  KITCHEN: 'Kitchen staff',
  WAITER: 'Waiter',
};

export function AcceptInvitationPage() {
  const { token = '' } = useParams<{ token: string }>();
  const { invitation, isLoading, isError, submit, isSubmitting } = useAcceptInvitation(token);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationSchema),
  });

  if (isLoading) {
    return (
      <AuthLayout>
        <SkeletonText lines={4} />
      </AuthLayout>
    );
  }

  if (isError || !invitation) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <AlertCircle size={32} className="text-danger" />
          <p className="text-sm font-semibold text-text">This invitation is invalid or has expired</p>
          <p className="text-xs text-text-muted">Ask the restaurant owner to send you a new invitation.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <p className="mb-1 text-sm text-text-muted">
        You&apos;ve been invited to join <strong className="text-text">{invitation.restaurantName}</strong> as a{' '}
        <strong className="text-text">{ROLE_LABELS[invitation.role] ?? invitation.role}</strong>.
      </p>
      <p className="mb-6 text-sm text-text-muted">Choose a password to activate your account.</p>

      <form className={f.form} onSubmit={handleSubmit(submit)}>
        <div className={f.field}>
          <label className={f.label}>Email</label>
          <input className={f.input} value={invitation.email} disabled />
        </div>

        <div className={f.field}>
          <label className={f.label} htmlFor="accept-password">
            Password
          </label>
          <input id="accept-password" type="password" className={f.input} {...register('password')} />
          {errors.password && <span className={f.error}>{errors.password.message}</span>}
        </div>

        <div className={f.field}>
          <label className={f.label} htmlFor="accept-confirm">
            Confirm password
          </label>
          <input id="accept-confirm" type="password" className={f.input} {...register('confirmPassword')} />
          {errors.confirmPassword && <span className={f.error}>{errors.confirmPassword.message}</span>}
        </div>

        <button type="submit" className={`${f.primaryButton} mt-1 w-full`} disabled={isSubmitting}>
          {isSubmitting ? 'Activating...' : 'Activate account'}
        </button>
      </form>
    </AuthLayout>
  );
}
