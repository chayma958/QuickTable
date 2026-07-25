import type { Order, OrderStatus } from '@models/index';
import { Check } from 'lucide-react';

interface StepDef {
  status: OrderStatus;
  label: string;
  timeField: keyof Order;
}

const STEPS: StepDef[] = [
  { status: 'PENDING', label: 'Order received', timeField: 'createdAt' },
  { status: 'CONFIRMED', label: 'Confirmed by restaurant', timeField: 'confirmedAt' },
  { status: 'PREPARING', label: 'Preparing your food', timeField: 'preparingAt' },
  { status: 'READY', label: 'Ready', timeField: 'readyAt' },
  { status: 'DELIVERED', label: 'Served', timeField: 'deliveredAt' },
];

const ORDER_INDEX: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'];

function formatTime(value: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function StatusTimeline({ order }: { order: Order }) {
  if (order.status === 'CANCELLED') {
    return <div className="py-4 text-center font-bold text-danger">This order was cancelled.</div>;
  }

  const steps =
    order.type === 'DINE_IN'
      ? STEPS
      : STEPS.map((step) => (step.status === 'DELIVERED' ? { ...step, label: 'Picked up' } : step));
  const currentIndex = ORDER_INDEX.indexOf(order.status);

  return (
    <div className="flex flex-col">
      {steps.map((step, i) => {
        const stepIndex = ORDER_INDEX.indexOf(step.status);
        const isDone = stepIndex <= currentIndex;
        const isActive = stepIndex === currentIndex;
        const isLast = i === steps.length - 1;
        const time = order[step.timeField] as string | null;

        return (
          <div key={step.status} className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                  isDone ? 'bg-brand' : 'bg-border'
                }`}
              >
                {isDone && !isActive ? <Check size={13} /> : i + 1}
              </div>
              {!isLast && <div className={`min-h-7 w-0.5 flex-1 ${isDone && !isActive ? 'bg-brand' : 'bg-border'}`} />}
            </div>
            <div className="pb-7">
              <div className={`text-[0.9375rem] font-semibold ${isDone ? 'text-text' : 'text-text-muted'}`}>
                {step.label}
              </div>
              {time && <div className="mt-0.5 text-xs text-text-muted">{formatTime(time)}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
