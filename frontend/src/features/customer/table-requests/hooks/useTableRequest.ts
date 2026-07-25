import { createTableRequest } from '@api/tables.api';
import type { TableRequestType } from '@models/index';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export function useTableRequest(tableId: string) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState<TableRequestType | null>(null);

  const mutation = useMutation({
    mutationFn: (type: TableRequestType) => createTableRequest(tableId, type),
    onSuccess: (_, type) => {
      setSent(type);
      setTimeout(() => {
        setSent(null);
        setOpen(false);
      }, 1800);
    },
  });

  return {
    open,
    openModal: () => setOpen(true),
    closeModal: () => setOpen(false),
    sent,
    isPending: mutation.isPending,
    send: (type: TableRequestType) => mutation.mutate(type),
  };
}
