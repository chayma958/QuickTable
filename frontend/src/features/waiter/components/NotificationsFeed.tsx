import type { WaiterNotification } from '@features/waiter/hooks/useWaiterDashboard';
import type { KitchenNoteReason } from '@models/index';
import { Bell, MessageCircleWarning, Receipt, UtensilsCrossed } from 'lucide-react';

const NOTE_REASON_LABELS: Record<KitchenNoteReason, string> = {
  ITEM_UNAVAILABLE: 'item unavailable',
  PREPARATION_DELAYED: 'preparation delayed',
  NEED_CLARIFICATION: 'needs clarification',
  CUSTOM: 'a note',
};

const KIND_CONFIG: Record<WaiterNotification['kind'], { icon: typeof Bell; label: (n: WaiterNotification) => string; tone: string }> = {
  ASSISTANCE: {
    icon: Bell,
    label: (n) => `Table ${n.tableNumber} needs assistance`,
    tone: 'bg-red-100 text-red-700',
  },
  BILL: {
    icon: Receipt,
    label: (n) => `Table ${n.tableNumber} requested the bill`,
    tone: 'bg-amber-100 text-amber-700',
  },
  ORDER_READY: {
    icon: UtensilsCrossed,
    label: (n) => `Order #${n.orderNumber} is ready for Table ${n.tableNumber}`,
    tone: 'bg-brand-light text-brand-dark',
  },
  KITCHEN_NOTE: {
    icon: MessageCircleWarning,
    label: (n) => `Kitchen: Table ${n.tableNumber} — ${NOTE_REASON_LABELS[n.reason!]}`,
    tone: 'bg-amber-100 text-amber-700',
  },
};

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function NotificationsFeed({
  notifications,
  onSelect,
}: {
  notifications: WaiterNotification[];
  onSelect: (tableId: string) => void;
}) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-text-muted">
        No active notifications — the dining room is quiet.
      </div>
    );
  }

  return (
    <div
      className="flex max-h-[calc(100vh-220px)] flex-col gap-2 overflow-y-auto pr-1
      [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border
      [&::-webkit-scrollbar-track]:bg-transparent"
    >
      {notifications.map((n) => {
        const config = KIND_CONFIG[n.kind];
        const Icon = config.icon;
        return (
          <button
            key={n.id}
            type="button"
            onClick={() => onSelect(n.tableId)}
            className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-bg p-3.5 text-left hover:bg-bg-subtle"
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.tone}`}>
              <Icon size={15} />
            </span>
            <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-semibold text-text">
              {config.label(n)}
            </span>
            <span className="shrink-0 text-xs text-text-muted">{formatTime(n.createdAt)}</span>
          </button>
        );
      })}
    </div>
  );
}
