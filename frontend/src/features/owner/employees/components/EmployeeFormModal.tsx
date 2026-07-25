import { Modal } from '@components/Modal/Modal';
import { formStyles as f } from '@components/ui/formStyles';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Employee } from '@models/index';
import { useForm } from 'react-hook-form';
import { ROLE_LABELS, employeeSchema, type EmployeeFormValues } from '../employee.schema';

export function EmployeeFormModal({
  initial,
  onClose,
  onSubmit,
}: {
  initial: Employee;
  onClose: () => void;
  onSubmit: (values: EmployeeFormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: initial.name,
      email: initial.email,
      phone: initial.phone ?? '',
      role: initial.role as EmployeeFormValues['role'],
    },
  });

  return (
    <Modal title="Edit employee" onClose={onClose}>
      <form className={f.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={f.field}>
          <label className={f.label} htmlFor="emp-name">
            Name
          </label>
          <input id="emp-name" className={f.input} {...register('name')} />
          {errors.name && <span className={f.error}>{errors.name.message}</span>}
        </div>

        <div className={f.field}>
          <label className={f.label} htmlFor="emp-email">
            Email
          </label>
          <input id="emp-email" type="email" className={f.input} {...register('email')} disabled />
          {errors.email && <span className={f.error}>{errors.email.message}</span>}
        </div>

        <div className={f.field}>
          <label className={f.label} htmlFor="emp-phone">
            Phone
          </label>
          <input id="emp-phone" className={f.input} {...register('phone')} />
        </div>

        <div className={f.field}>
          <label className={f.label} htmlFor="emp-role">
            Role
          </label>
          <select id="emp-role" className={f.select} {...register('role')}>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={f.actions}>
          <button type="button" className={f.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={f.primaryButton} disabled={isSubmitting}>
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
