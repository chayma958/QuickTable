import { Modal } from '@components/Modal/Modal';
import { formStyles as f } from '@components/ui/formStyles';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ROLE_LABELS } from '../employee.schema';
import { inviteEmployeeSchema, type InviteEmployeeFormValues } from '../invite.schema';

export function InviteEmployeeModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (values: InviteEmployeeFormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteEmployeeFormValues>({
    resolver: zodResolver(inviteEmployeeSchema),
    defaultValues: { role: 'WAITER' },
  });

  return (
    <Modal title="Invite employee" onClose={onClose}>
      <form className={f.form} onSubmit={handleSubmit((values) => onSubmit(values).catch(() => {}))}>
        <div className={f.field}>
          <label className={f.label} htmlFor="invite-name">
            Name
          </label>
          <input id="invite-name" className={f.input} {...register('name')} />
          {errors.name && <span className={f.error}>{errors.name.message}</span>}
        </div>

        <div className={f.field}>
          <label className={f.label} htmlFor="invite-email">
            Email
          </label>
          <input id="invite-email" type="email" className={f.input} {...register('email')} />
          {errors.email && <span className={f.error}>{errors.email.message}</span>}
        </div>

        <div className={f.field}>
          <label className={f.label} htmlFor="invite-role">
            Role
          </label>
          <select id="invite-role" className={f.select} {...register('role')}>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-text-muted">
          We&apos;ll email them a link to activate their account and set their own password.
        </p>

        <div className={f.actions}>
          <button type="button" className={f.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={f.primaryButton} disabled={isSubmitting}>
            Send invitation
          </button>
        </div>
      </form>
    </Modal>
  );
}
