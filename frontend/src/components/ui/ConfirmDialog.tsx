import { Modal } from '@components/Modal/Modal';
import { formStyles as f } from '@components/ui/formStyles';

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  isDestructive,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="mb-5 text-sm text-text-muted">{message}</p>
      <div className={f.actions}>
        <button type="button" className={f.secondaryButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={
            isDestructive
              ? 'rounded-xl bg-danger px-4 py-2.5 text-sm font-bold text-white hover:bg-danger/90'
              : f.primaryButton
          }
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
