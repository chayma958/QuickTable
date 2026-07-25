import { Avatar } from '@components/ui/Avatar';
import type { Employee } from '@models/index';
import { ROLE_LABELS } from '../employee.schema';

export function EmployeeRow({
  employee,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  employee: Employee;
  onEdit: () => void;
  onToggleActive: (isActive: boolean) => void;
  onDelete: () => void;
}) {
  return (
    <div className="mb-2.5 flex items-center gap-4 rounded-xl border border-border bg-bg p-3.5">
      <Avatar name={employee.name} src={employee.avatarUrl} size={36} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-text">{employee.name}</div>
        <div className="text-xs text-text-muted">{employee.email}</div>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-bold capitalize ${
          employee.isActive ? 'bg-bg-subtle text-text-muted' : 'bg-red-100 text-red-800'
        }`}
      >
        {employee.isActive ? ROLE_LABELS[employee.role as keyof typeof ROLE_LABELS] : 'Inactive'}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg-subtle"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onToggleActive(!employee.isActive)}
          className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg-subtle"
        >
          {employee.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-danger px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/10"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
