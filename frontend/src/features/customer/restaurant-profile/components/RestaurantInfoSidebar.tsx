import type { Restaurant } from '@models/index';
import {
  Accessibility,
  Clock,
  CreditCard,
  MapPin,
  PawPrint,
  Phone,
  Timer,
  Wifi,
} from 'lucide-react';
import { isOpenNow, todayHoursLabel } from '../opening-hours.util';

function getAmenities(restaurant: Restaurant) {
  return [
    restaurant.hasParking && { icon: MapPin, label: 'Parking available' },
    restaurant.hasWifi && { icon: Wifi, label: 'Free WiFi' },
    restaurant.isWheelchairAccessible && { icon: Accessibility, label: 'Wheelchair accessible' },
    restaurant.isPetFriendly && { icon: PawPrint, label: 'Pet friendly' },
    restaurant.acceptsCardPayment && { icon: CreditCard, label: 'Cash & card accepted' },
  ].filter(Boolean) as { icon: typeof MapPin; label: string }[];
}

export function RestaurantInfoSidebar({
  restaurant,
  avgPrepMinutes,
  tableNumber,
  hasGuestSession,
  onStartOrdering,
}: {
  restaurant: Restaurant;
  avgPrepMinutes: number | null;
  tableNumber: number;
  hasGuestSession: boolean;
  onStartOrdering: () => void;
}) {
  const open = isOpenNow(restaurant.openingHours);
  const address = [restaurant.address, restaurant.city, restaurant.country].filter(Boolean).join(', ');
  const amenities = getAmenities(restaurant);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-base font-bold text-text">Restaurant info</span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              open ? 'bg-[var(--color-status-ready-bg)] text-[var(--color-status-ready)]' : 'bg-bg-subtle text-text-muted'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-[var(--color-status-ready)]' : 'bg-text-muted'}`} />
            {open ? 'Open Now' : 'Closed'}
          </span>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-start gap-2.5 text-text">
            <Clock size={16} className="mt-0.5 shrink-0 text-text-muted" />
            <span>Today: {todayHoursLabel(restaurant.openingHours)}</span>
          </div>
          {address && (
            <div className="flex items-start gap-2.5 text-text">
              <MapPin size={16} className="mt-0.5 shrink-0 text-text-muted" />
              <span>{address}</span>
            </div>
          )}
          {restaurant.phone && (
            <div className="flex items-start gap-2.5 text-text">
              <Phone size={16} className="mt-0.5 shrink-0 text-text-muted" />
              <a href={`tel:${restaurant.phone}`} className="hover:text-brand hover:underline">
                {restaurant.phone}
              </a>
            </div>
          )}
          {avgPrepMinutes != null && (
            <div className="flex items-start gap-2.5 text-text">
              <Timer size={16} className="mt-0.5 shrink-0 text-text-muted" />
              <span>~{avgPrepMinutes} min average prep time</span>
            </div>
          )}
        </div>

        <div className="my-4 border-t border-dashed border-border" />

        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="font-semibold text-text">Table {tableNumber}</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted">
            <span className={`h-2 w-2 rounded-full ${hasGuestSession ? 'bg-success' : 'bg-border'}`} />
            {hasGuestSession ? 'Guest Session Active' : 'No session yet'}
          </span>
        </div>

        <button
          type="button"
          onClick={onStartOrdering}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 text-[0.9375rem] font-bold text-white shadow-soft transition-colors hover:bg-brand-dark"
        >
          Start Ordering
        </button>
      </div>

      {amenities.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <span className="mb-3 block text-sm font-bold text-text">Amenities</span>
          <div className="flex flex-col gap-2.5">
            {amenities.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm text-text-muted">
                <Icon size={16} className="text-brand" />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
