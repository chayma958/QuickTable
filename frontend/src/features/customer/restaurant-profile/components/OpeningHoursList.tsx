import type { OpeningHours } from '@models/index';
import { Clock } from 'lucide-react';
import { isOpenNow, todayKey, WEEKDAYS } from '../opening-hours.util';

export function OpeningHoursList({ hours }: { hours: OpeningHours | null }) {
  if (!hours) return null;
  const open = isOpenNow(hours);
  const today = todayKey();

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-base font-bold text-text">
          <Clock size={18} className="text-brand" />
          Opening Hours
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            open ? 'bg-[var(--color-status-ready-bg)] text-[var(--color-status-ready)]' : 'bg-bg-subtle text-text-muted'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-[var(--color-status-ready)]' : 'bg-text-muted'}`} />
          {open ? 'Open now' : 'Closed now'}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {WEEKDAYS.map((day) => {
          const d = hours[day];
          const isToday = day === today;
          return (
            <div
              key={day}
              className={`flex justify-between rounded-lg px-3 py-2 text-sm ${
                isToday ? 'bg-brand-light font-bold text-brand-dark' : 'text-text'
              }`}
            >
              <span className="capitalize">
                {day}
                {isToday && <span className="ml-1.5 text-xs font-semibold">(Today)</span>}
              </span>
              <span className={isToday ? 'text-brand-dark' : 'text-text-muted'}>
                {d && !d.closed ? `${d.open} – ${d.close}` : 'Closed'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
