import { assignTableWaiter, createTable, deleteTable, getTables, setTableActive } from '@api/tables.api';
import { getEmployees } from '@api/employees.api';
import { useToast } from '@store/toast-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export function useTablesPage(restaurantId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [newNumber, setNewNumber] = useState('');

  const tablesQuery = useQuery({
    queryKey: ['tables', restaurantId],
    queryFn: () => getTables(restaurantId),
  });

  const employeesQuery = useQuery({
    queryKey: ['employees', restaurantId],
    queryFn: () => getEmployees(restaurantId),
  });
  const waiters = (employeesQuery.data ?? []).filter((e) => e.role === 'WAITER' && e.isActive);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
  }

  const createMutation = useMutation({
    mutationFn: (number: number) => createTable(restaurantId, number),
    onSuccess: () => {
      invalidate();
      setNewNumber('');
      toast.success('Table added');
    },
  });
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => setTableActive(restaurantId, id, isActive),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTable(restaurantId, id),
    onSuccess: () => {
      invalidate();
      toast.success('Table removed');
    },
  });
  const assignMutation = useMutation({
    mutationFn: ({ id, waiterId }: { id: string; waiterId: string | null }) =>
      assignTableWaiter(restaurantId, id, waiterId),
    onSuccess: () => {
      invalidate();
      toast.success('Assignment updated');
    },
    onError: () => toast.error('Could not update the assignment'),
  });

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(newNumber);
    if (num > 0) createMutation.mutate(num);
  }

  return {
    tables: tablesQuery.data ?? [],
    waiters,
    newNumber,
    setNewNumber,
    handleAddSubmit,
    toggleActive: (id: string, isActive: boolean) => toggleMutation.mutate({ id, isActive }),
    deleteTable: (id: string) => deleteMutation.mutate(id),
    assignWaiter: (id: string, waiterId: string | null) => assignMutation.mutate({ id, waiterId }),
  };
}
