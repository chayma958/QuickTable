import { Modal } from '@components/Modal/Modal';
import { ConfirmDialog } from '@components/ui/ConfirmDialog';
import { formStyles as f } from '@components/ui/formStyles';
import { STATUS_BADGE_CLASS } from '@lib/order-status-style';
import type { KitchenNoteReason, Order, TableOverview } from '@models/index';
import { printReceipt } from '@lib/print-receipt';
import { Bell, MessageCircleWarning, Receipt, X } from 'lucide-react';
import { useState } from 'react';

const REQUEST_LABELS: Record<'ASSISTANCE' | 'BILL', string> = {
  ASSISTANCE: 'Needs assistance',
  BILL: 'Requested the bill',
};

const NOTE_REASON_LABELS: Record<KitchenNoteReason, string> = {
  ITEM_UNAVAILABLE: 'Item unavailable',
  PREPARATION_DELAYED: 'Preparation delayed',
  NEED_CLARIFICATION: 'Need clarification',
  CUSTOM: 'Kitchen note',
};

export function TableDetailModal({
  table,
  restaurantName,
  onClose,
  onMarkServed,
  onMarkPaid,
  onResolveRequest,
  onCloseTable,
  closeTableError,
  onSplitBill,
  onTransfer,
  onCancelOrder,
  onRemoveItem,
  onAcknowledgeNote,
}: {
  table: TableOverview;
  restaurantName: string;
  onClose: () => void;
  onMarkServed: (orderId: string) => void;
  onMarkPaid: (orderId: string) => void;
  onResolveRequest: (requestId: string) => void;
  onCloseTable: () => void;
  closeTableError: string | null;
  onSplitBill: (order: Order) => void;
  onTransfer: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
  onRemoveItem: (orderId: string, itemId: string) => void;
  onAcknowledgeNote: (orderId: string, noteId: string) => void;
}) {
  const hasUnpaid = table.activeOrders.some((o) => o.paymentStatus !== 'PAID');
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  return (
    <Modal title={`Table ${table.number}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {table.requests.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className={f.label}>Requests</span>
            {table.requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3"
              >
                {request.type === 'BILL' ? (
                  <Receipt size={16} className="shrink-0 text-red-600" />
                ) : (
                  <Bell size={16} className="shrink-0 text-red-600" />
                )}
                <span className="flex-1 text-sm font-semibold text-red-800">
                  {REQUEST_LABELS[request.type]}
                </span>
                <button
                  type="button"
                  onClick={() => onResolveRequest(request.id)}
                  className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        )}

        {table.kitchenNotes.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className={f.label}>Kitchen notes</span>
            {table.kitchenNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3"
              >
                <MessageCircleWarning size={16} className="mt-0.5 shrink-0 text-amber-600" />
                <div className="flex-1">
                  <span className="block text-sm font-semibold text-amber-800">
                    {NOTE_REASON_LABELS[note.reason]}
                  </span>
                  {note.message && <span className="block text-xs text-amber-700">{note.message}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => onAcknowledgeNote(note.orderId, note.id)}
                  className="shrink-0 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                >
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        )}

        {table.activeOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-text-muted">
            No open orders on this table right now.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {table.activeOrders.map((order) => (
              <div key={order.id} className="rounded-xl border border-border bg-bg-subtle p-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-text">Order #{order.orderNumber}</span>
                  <div className="flex gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-bold uppercase ${STATUS_BADGE_CLASS[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-bold uppercase ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-[var(--color-status-ready-bg)] text-[var(--color-status-ready)]'
                          : 'bg-[var(--color-status-pending-bg)] text-[var(--color-status-pending)]'
                      }`}
                    >
                      {order.paymentStatus === 'PAID' ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </div>
                <div className="mb-2.5 text-[0.8125rem] text-text">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 py-0.5">
                      <span>
                        {item.quantity}x {item.nameSnapshot}
                      </span>
                      <span className="flex items-center gap-2">
                        ${Number(item.subtotal).toFixed(2)}
                        {order.status === 'PENDING' && order.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onRemoveItem(order.id, item.id)}
                            aria-label={`Remove ${item.nameSnapshot}`}
                            className="text-text-muted hover:text-danger"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </span>
                    </div>
                  ))}
                  <div className="mt-1 flex justify-between border-t border-dashed border-border pt-1.5 font-bold">
                    <span>Total</span>
                    <span>${Number(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.status === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() => setCancelOrderId(order.id)}
                      className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/15"
                    >
                      Cancel order
                    </button>
                  )}
                  {order.status === 'READY' && (
                    <button
                      type="button"
                      onClick={() => onMarkServed(order.id)}
                      className="rounded-lg border border-brand bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
                    >
                      Mark food as served
                    </button>
                  )}
                  {order.paymentStatus !== 'PAID' && (
                    <button
                      type="button"
                      onClick={() => onMarkPaid(order.id)}
                      className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg-subtle"
                    >
                      Accept cash payment
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => printReceipt(order, restaurantName)}
                    className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg-subtle"
                  >
                    Print receipt
                  </button>
                  <button
                    type="button"
                    onClick={() => onSplitBill(order)}
                    className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg-subtle"
                  >
                    Split bill
                  </button>
                  <button
                    type="button"
                    onClick={() => onTransfer(order)}
                    className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text hover:bg-bg-subtle"
                  >
                    Transfer table
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={f.actions}>
          {closeTableError && <span className={`${f.error} flex-1 self-center`}>{closeTableError}</span>}
          <button type="button" className={f.secondaryButton} onClick={onClose}>
            Done
          </button>
          <button
            type="button"
            className={f.primaryButton}
            disabled={hasUnpaid || !table.isOccupied}
            title={
              !table.isOccupied
                ? 'This table is already closed'
                : hasUnpaid
                  ? 'Collect payment on every order before closing this table'
                  : undefined
            }
            onClick={onCloseTable}
          >
            {table.isOccupied ? 'Close table' : 'Table closed'}
          </button>
        </div>
      </div>

      {cancelOrderId && (
        <ConfirmDialog
          title="Cancel order"
          message="This order hasn't been confirmed by the kitchen yet. Cancel it?"
          confirmLabel="Cancel order"
          isDestructive
          onCancel={() => setCancelOrderId(null)}
          onConfirm={() => {
            onCancelOrder(cancelOrderId);
            setCancelOrderId(null);
          }}
        />
      )}
    </Modal>
  );
}
