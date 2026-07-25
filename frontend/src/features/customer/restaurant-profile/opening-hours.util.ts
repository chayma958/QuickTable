import type { OpeningHours } from '@models/index';

export const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function todayKey(): (typeof WEEKDAYS)[number] {
  return WEEKDAYS[(new Date().getDay() + 6) % 7];
}

export function isOpenNow(hours: OpeningHours | null | undefined): boolean {
  if (!hours) return false;
  const today = hours[todayKey()];
  if (!today || today.closed) return false;
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = today.open.split(':').map(Number);
  const [closeH, closeM] = today.close.split(':').map(Number);
  return minutesNow >= openH * 60 + openM && minutesNow <= closeH * 60 + closeM;
}

export function todayHoursLabel(hours: OpeningHours | null | undefined): string {
  if (!hours) return '—';
  const today = hours[todayKey()];
  if (!today || today.closed) return 'Closed today';
  return `${today.open} – ${today.close}`;
}
