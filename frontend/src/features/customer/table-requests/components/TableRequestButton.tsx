import { Modal } from '@components/Modal/Modal';
import { useTableRequest } from '@features/customer/table-requests/hooks/useTableRequest';
import { Bell, Check, Receipt } from 'lucide-react';

export function TableRequestButton({ tableId }: { tableId: string }) {
  const { open, openModal, closeModal, sent, isPending, send } = useTableRequest(tableId);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label="Need something?"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-subtle text-text-muted hover:text-text"
      >
        <Bell size={15} />
      </button>

      {open && (
        <Modal title="Need something?" onClose={closeModal}>
          {sent ? (
            <div className="flex flex-col items-center gap-2.5 py-4 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success/15 text-success">
                <Check size={20} />
              </span>
              <p className="text-sm font-semibold text-text">
                {sent === 'BILL' ? 'Bill requested — a waiter is on the way' : 'A waiter has been notified'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                disabled={isPending}
                onClick={() => send('ASSISTANCE')}
                className="flex items-center gap-3 rounded-xl border border-border px-4 py-3.5 text-left text-sm font-semibold text-text hover:bg-bg-subtle disabled:opacity-60"
              >
                <Bell size={16} className="text-brand" />
                Call a waiter
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => send('BILL')}
                className="flex items-center gap-3 rounded-xl border border-border px-4 py-3.5 text-left text-sm font-semibold text-text hover:bg-bg-subtle disabled:opacity-60"
              >
                <Receipt size={16} className="text-brand" />
                Request the bill
              </button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
