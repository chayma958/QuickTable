import { Modal } from '@components/Modal/Modal';
import { formStyles as f } from '@components/ui/formStyles';
import type { Order } from '@models/index';
import { useMemo, useState } from 'react';

interface BillUnit {
  key: string;
  itemId: string;
  unitIndex: number;
  name: string;
  unitPrice: number;
}

function buildUnits(order: Order): BillUnit[] {
  const units: BillUnit[] = [];
  for (const item of order.items) {
    const unitPrice = Number(item.priceSnapshot);
    for (let i = 0; i < item.quantity; i++) {
      units.push({ key: `${item.id}:${i}`, itemId: item.id, unitIndex: i, name: item.nameSnapshot, unitPrice });
    }
  }
  return units;
}

export function SplitBillModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const units = useMemo(() => buildUnits(order), [order]);
  const [guestCount, setGuestCount] = useState(2);
  const [assignments, setAssignments] = useState<Record<string, number>>(() =>
    Object.fromEntries(units.map((unit) => [unit.key, 1])),
  );

  function assignUnit(unitKey: string, guest: number) {
    setAssignments((prev) => ({ ...prev, [unitKey]: guest }));
  }

  function changeGuestCount(next: number) {
    const clamped = Math.max(1, Math.min(8, next));
    setGuestCount(clamped);
    setAssignments((prev) => {
      const updated = { ...prev };
      for (const [unitKey, guest] of Object.entries(updated)) {
        if (guest > clamped) updated[unitKey] = clamped;
      }
      return updated;
    });
  }

  const extras = Number(order.taxAmount) - Number(order.discountAmount);
  const subtotal = Number(order.subtotal);

  const perGuest = useMemo(() => {
    const totals = Array.from({ length: guestCount }, () => 0);
    for (const unit of units) {
      const guest = assignments[unit.key] ?? 1;
      totals[guest - 1] += unit.unitPrice;
    }
    return totals.map((guestSubtotal) => {
      const share = subtotal > 0 ? guestSubtotal / subtotal : 0;
      return guestSubtotal + share * extras;
    });
  }, [assignments, guestCount, units, subtotal, extras]);

  const groupedByItem = useMemo(() => {
    const groups = new Map<string, BillUnit[]>();
    for (const unit of units) {
      const list = groups.get(unit.itemId) ?? [];
      list.push(unit);
      groups.set(unit.itemId, list);
    }
    return [...groups.values()];
  }, [units]);

  return (
    <Modal title={`Split bill — Order #${order.orderNumber}`} onClose={onClose}>
      <p className="mb-4 text-xs text-text-muted">
        This is a reference calculator to help you collect the right amount from each guest — it
        doesn&apos;t change the order or its payment status. Use &quot;Accept cash payment&quot; on
        the table once you&apos;ve collected the total.
      </p>
      <div className="mb-4 flex items-center gap-3">
        <span className={f.label}>Guests:</span>
        <button
          type="button"
          onClick={() => changeGuestCount(guestCount - 1)}
          className="h-8 w-8 rounded-lg border border-border bg-bg font-bold hover:bg-bg-subtle"
        >
          −
        </button>
        <span className="text-sm font-semibold text-text">{guestCount}</span>
        <button
          type="button"
          onClick={() => changeGuestCount(guestCount + 1)}
          className="h-8 w-8 rounded-lg border border-border bg-bg font-bold hover:bg-bg-subtle"
        >
          +
        </button>
      </div>

      <div className="mb-4 max-h-[240px] overflow-y-auto rounded-lg border border-border p-2">
        {groupedByItem.map((itemUnits) => (
          <div key={itemUnits[0].itemId} className="border-b border-bg-subtle px-1.5 py-2 last:border-b-0">
            {itemUnits.length === 1 ? (
              <div className="flex items-center gap-3">
                <span className="flex-1 text-[0.8125rem] font-semibold text-text">{itemUnits[0].name}</span>
                <div className="flex gap-1">
                  {Array.from({ length: guestCount }, (_, i) => i + 1).map((guest) => (
                    <button
                      key={guest}
                      type="button"
                      onClick={() => assignUnit(itemUnits[0].key, guest)}
                      className={`h-7 w-7 rounded-full border text-xs font-bold ${
                        assignments[itemUnits[0].key] === guest
                          ? 'border-brand bg-brand text-white'
                          : 'border-border bg-bg text-text hover:bg-bg-subtle'
                      }`}
                    >
                      {guest}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="flex-1 text-[0.8125rem] font-semibold text-text">
                    {itemUnits.length}x {itemUnits[0].name}
                  </span>
                </div>
                {itemUnits.map((unit) => (
                  <div key={unit.key} className="flex items-center gap-3 py-1.5 pl-4">
                    <span className="flex-1 text-xs text-text-muted">Unit {unit.unitIndex + 1}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: guestCount }, (_, i) => i + 1).map((guest) => (
                        <button
                          key={guest}
                          type="button"
                          onClick={() => assignUnit(unit.key, guest)}
                          className={`h-7 w-7 rounded-full border text-xs font-bold ${
                            assignments[unit.key] === guest
                              ? 'border-brand bg-brand text-white'
                              : 'border-border bg-bg text-text hover:bg-bg-subtle'
                          }`}
                        >
                          {guest}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {perGuest.map((total, i) => (
          <div key={i} className="flex justify-between rounded-lg bg-bg-subtle px-3.5 py-2.5 text-sm">
            <span className="font-semibold text-text">Guest {i + 1}</span>
            <span className="font-bold text-text">${total.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className={f.actions}>
        <button type="button" className={f.secondaryButton} onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
