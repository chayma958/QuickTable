import type { OpeningHours } from '@models/index';
import { WEEKDAYS } from '../settings.schema';

export function OpeningHoursEditor({
  value,
  onChange,
}: {
  value: OpeningHours;
  onChange: (value: OpeningHours) => void;
}) {
  function updateDay(day: string, patch: Partial<OpeningHours[string]>) {
    const current = value[day] ?? { open: '09:00', close: '22:00', closed: false };
    onChange({ ...value, [day]: { ...current, ...patch } });
  }

  return (
    <div>
      {WEEKDAYS.map((day) => {
        const dayValue = value[day] ?? { open: '09:00', close: '22:00', closed: false };
        return (
          <div key={day} className="flex items-center gap-3 border-b border-bg-subtle py-2 last:border-b-0">
            <span className="w-[5.5rem] text-[0.8125rem] font-semibold capitalize text-text">{day}</span>
            <input
              type="time"
              value={dayValue.open}
              disabled={dayValue.closed}
              onChange={(e) => updateDay(day, { open: e.target.value })}
              className="rounded-lg border border-border px-2 py-1.5 text-[0.8125rem]"
            />
            <span className="text-text-muted">–</span>
            <input
              type="time"
              value={dayValue.close}
              disabled={dayValue.closed}
              onChange={(e) => updateDay(day, { close: e.target.value })}
              className="rounded-lg border border-border px-2 py-1.5 text-[0.8125rem]"
            />
            <label className="ml-auto flex items-center gap-1.5 text-xs text-text-muted">
              <input
                type="checkbox"
                checked={dayValue.closed}
                onChange={(e) => updateDay(day, { closed: e.target.checked })}
              />
              Closed
            </label>
          </div>
        );
      })}
    </div>
  );
}
