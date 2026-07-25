import { Modal } from '@components/Modal/Modal';
import { formStyles as f } from '@components/ui/formStyles';
import type { KitchenNoteReason, Order } from '@models/index';
import { useState } from 'react';

const REASON_OPTIONS: { value: KitchenNoteReason; label: string }[] = [
  { value: 'ITEM_UNAVAILABLE', label: 'Item unavailable' },
  { value: 'PREPARATION_DELAYED', label: 'Preparation delayed' },
  { value: 'NEED_CLARIFICATION', label: 'Need clarification' },
  { value: 'CUSTOM', label: 'Custom' },
];

export function NotifyWaiterModal({
  order,
  isSending,
  onClose,
  onSend,
}: {
  order: Order;
  isSending: boolean;
  onClose: () => void;
  onSend: (reason: KitchenNoteReason, message?: string) => void;
}) {
  const [reason, setReason] = useState<KitchenNoteReason>('ITEM_UNAVAILABLE');
  const [message, setMessage] = useState('');
  const requiresMessage = reason === 'CUSTOM';

  return (
    <Modal title={`Notify waiter — Order #${order.orderNumber}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {REASON_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                reason === option.value
                  ? 'border-brand bg-brand-light text-brand-dark'
                  : 'border-border bg-surface text-text hover:bg-bg-subtle'
              }`}
            >
              <input
                type="radio"
                name="reason"
                value={option.value}
                checked={reason === option.value}
                onChange={() => setReason(option.value)}
                className="accent-current"
              />
              {option.label}
            </label>
          ))}
        </div>

        <div className={f.field}>
          <label className={f.label} htmlFor="note-message">
            Message {requiresMessage ? '' : '(optional)'}
          </label>
          <textarea
            id="note-message"
            rows={3}
            placeholder={requiresMessage ? 'Describe the issue…' : 'Add any extra detail…'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-light"
          />
        </div>

        <div className={f.actions}>
          <button type="button" className={f.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={f.primaryButton}
            disabled={isSending || (requiresMessage && !message.trim())}
            onClick={() => onSend(reason, message.trim() || undefined)}
          >
            {isSending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
