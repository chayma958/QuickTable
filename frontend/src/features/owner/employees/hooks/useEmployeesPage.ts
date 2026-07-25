import { deleteEmployee, getEmployees, updateEmployee } from '@api/employees.api';
import { createInvitation, getInvitations, revokeInvitation } from '@api/invitations.api';
import type { Employee, Invitation } from '@models/index';
import { useToast } from '@store/toast-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { EmployeeFormValues } from '../employee.schema';
import type { InviteEmployeeFormValues } from '../invite.schema';

function errorMessage(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
  );
}

export function useEmployeesPage(restaurantId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [modalState, setModalState] = useState<{ open: boolean; employee?: Employee }>({ open: false });
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteUrls, setInviteUrls] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);

  const employeesQuery = useQuery({
    queryKey: ['employees', restaurantId],
    queryFn: () => getEmployees(restaurantId),
  });

  const invitationsQuery = useQuery({
    queryKey: ['invitations', restaurantId],
    queryFn: () => getInvitations(restaurantId),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['employees', restaurantId] });
  }

  function invalidateInvitations() {
    queryClient.invalidateQueries({ queryKey: ['invitations', restaurantId] });
  }

  const inviteMutation = useMutation({
    mutationFn: (values: InviteEmployeeFormValues) => createInvitation(restaurantId, values),
    onSuccess: (invitation) => {
      invalidateInvitations();
      if (invitation.inviteUrl) {
        setInviteUrls((prev) => ({ ...prev, [invitation.id]: invitation.inviteUrl! }));
      }
      toast.success(`Invitation sent to ${invitation.email}`);
      setInviteModalOpen(false);
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not send this invitation')),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => revokeInvitation(restaurantId, id),
    onSuccess: () => {
      invalidateInvitations();
      toast.success('Invitation revoked');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not revoke this invitation')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: EmployeeFormValues }) =>
      updateEmployee(restaurantId, id, { name: values.name, phone: values.phone, role: values.role }),
    onSuccess: () => {
      invalidate();
      toast.success('Employee updated');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not update this employee')),
  });
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateEmployee(restaurantId, id, { isActive }),
    onSuccess: invalidate,
    onError: (err) => toast.error(errorMessage(err, 'Could not update this employee')),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmployee(restaurantId, id),
    onSuccess: () => {
      invalidate();
      toast.success('Employee removed');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not remove this employee')),
  });

  async function handleSubmit(values: EmployeeFormValues) {
    if (!modalState.employee) return;
    try {
      await updateMutation.mutateAsync({ id: modalState.employee.id, values });
      setModalState({ open: false });
    } catch {
    }
  }

  const invitations: Invitation[] = (invitationsQuery.data ?? []).map((invite) => ({
    ...invite,
    inviteUrl: invite.inviteUrl ?? inviteUrls[invite.id],
  }));

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id);
    setPendingDelete(null);
  }

  return {
    employees: employeesQuery.data ?? [],
    invitations,
    modalState,
    inviteModalOpen,
    openInvite: () => setInviteModalOpen(true),
    closeInviteModal: () => setInviteModalOpen(false),
    submitInvite: (values: InviteEmployeeFormValues) =>
      inviteMutation.mutateAsync(values).then(() => undefined),
    revokeInvitation: (id: string) => revokeMutation.mutate(id),
    openEdit: (employee: Employee) => setModalState({ open: true, employee }),
    closeModal: () => setModalState({ open: false }),
    handleSubmit,
    toggleActive: (id: string, isActive: boolean) => toggleMutation.mutate({ id, isActive }),
    pendingDelete,
    requestDelete: (employee: Employee) => setPendingDelete(employee),
    cancelDelete: () => setPendingDelete(null),
    confirmDelete,
  };
}
