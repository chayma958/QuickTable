import { ConfirmDialog } from '@components/ui/ConfirmDialog';
import { EmptyState } from '@components/ui/EmptyState';
import { EmployeeFormModal } from '@features/owner/employees/components/EmployeeFormModal';
import { EmployeeRow } from '@features/owner/employees/components/EmployeeRow';
import { InviteEmployeeModal } from '@features/owner/employees/components/InviteEmployeeModal';
import { PendingInvitationsPanel } from '@features/owner/employees/components/PendingInvitationsPanel';
import { useEmployeesPage } from '@features/owner/employees/hooks/useEmployeesPage';
import { useOwnerContext } from '@layouts/OwnerShell';
import { Users } from 'lucide-react';

export function EmployeesPage() {
  const { restaurant } = useOwnerContext();
  const {
    employees,
    invitations,
    modalState,
    inviteModalOpen,
    openInvite,
    closeInviteModal,
    submitInvite,
    revokeInvitation,
    openEdit,
    closeModal,
    handleSubmit,
    toggleActive,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useEmployeesPage(restaurant.id);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[1.375rem] font-bold text-text">Employees</h1>
        <button
          type="button"
          onClick={openInvite}
          className="rounded-lg bg-brand px-4.5 py-2.5 text-[0.8125rem] font-semibold text-white hover:bg-brand-dark"
        >
          + Invite employee
        </button>
      </div>

      <PendingInvitationsPanel invitations={invitations} onRevoke={revokeInvitation} />

      {employees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No employees yet"
          description="Invite managers, kitchen staff, or waiters — they'll get a link to activate their account and set their own password."
          action={
            <button
              type="button"
              onClick={openInvite}
              className="rounded-lg bg-brand px-4.5 py-2.5 text-[0.8125rem] font-semibold text-white hover:bg-brand-dark"
            >
              + Invite employee
            </button>
          }
        />
      ) : (
        employees.map((employee) => (
          <EmployeeRow
            key={employee.id}
            employee={employee}
            onEdit={() => openEdit(employee)}
            onToggleActive={(isActive) => toggleActive(employee.id, isActive)}
            onDelete={() => requestDelete(employee)}
          />
        ))
      )}

      {modalState.open && modalState.employee && (
        <EmployeeFormModal initial={modalState.employee} onClose={closeModal} onSubmit={handleSubmit} />
      )}

      {inviteModalOpen && (
        <InviteEmployeeModal onClose={closeInviteModal} onSubmit={submitInvite} />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Remove employee"
          message={`Remove ${pendingDelete.name} from your staff? They'll lose access immediately.`}
          confirmLabel="Remove"
          isDestructive
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
