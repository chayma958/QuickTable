import { Modal } from '@components/Modal/Modal';
import { formStyles as f } from '@components/ui/formStyles';
import type { RestaurantTable } from '@models/index';
import { useState } from 'react';

export function TransferTableModal({
  tables,
  currentTableId,
  onClose,
  onConfirm,
}: {
  tables: RestaurantTable[];
  currentTableId: string | null;
  onClose: () => void;
  onConfirm: (tableId: string) => Promise<void>;
}) {
  const [tableId, setTableId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otherTables = tables.filter((t) => t.id !== currentTableId && t.isActive);

  async function handleConfirm() {
    if (!tableId) return;
    setIsSubmitting(true);
    try {
      await onConfirm(tableId);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title="Transfer table" onClose={onClose}>
      <div className={f.form}>
        <div className={f.field}>
          <label className={f.label} htmlFor="transfer-table">
            Move this order to
          </label>
          <select id="transfer-table" className={f.select} value={tableId} onChange={(e) => setTableId(e.target.value)}>
            <option value="">Select a table</option>
            {otherTables.map((t) => (
              <option key={t.id} value={t.id}>
                Table {t.number}
              </option>
            ))}
          </select>
        </div>
        <div className={f.actions}>
          <button type="button" className={f.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={f.primaryButton} disabled={!tableId || isSubmitting} onClick={handleConfirm}>
            Transfer
          </button>
        </div>
      </div>
    </Modal>
  );
}
