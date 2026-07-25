import { Skeleton } from '@components/ui/Skeleton';
import { DashboardLayout } from '@layouts/DashboardLayout/DashboardLayout';
import { useMyRestaurant } from '@hooks/useMyRestaurant';
import { useRestaurantRealtime } from '@hooks/useRestaurantRealtime';
import type { Restaurant } from '@models/index';
import {
  BarChart3,
  ClipboardList,
  History,
  LayoutDashboard,
  LayoutGrid,
  Settings,
  Tags,
  Ticket,
  UtensilsCrossed,
  Users,
} from 'lucide-react';
import { Outlet, useOutletContext } from 'react-router-dom';

const OWNER_NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', end: true, icon: LayoutDashboard },
  { label: 'Orders', to: '/dashboard/orders', icon: ClipboardList },
  { label: 'Menu', to: '/dashboard/menu', icon: UtensilsCrossed },
  { label: 'Categories', to: '/dashboard/categories', icon: Tags },
  { label: 'Tables', to: '/dashboard/tables', icon: LayoutGrid },
  { label: 'Coupons', to: '/dashboard/coupons', icon: Ticket },
  { label: 'Employees', to: '/dashboard/employees', icon: Users },
  { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Activity', to: '/dashboard/activity', icon: History },
  { label: 'Settings', to: '/dashboard/settings', icon: Settings },
];

interface OwnerContext {
  restaurant: Restaurant;
}

export function useOwnerContext(): OwnerContext {
  return useOutletContext<OwnerContext>();
}

export function OwnerShell() {
  const { data: restaurant, isLoading } = useMyRestaurant();
  useRestaurantRealtime(restaurant?.id);

  if (isLoading || !restaurant) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden w-60 shrink-0 bg-[#111110] md:block" />
        <div className="flex-1 p-6">
          <Skeleton className="mb-5 h-7 w-32" />
          <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title={restaurant.name} navItems={OWNER_NAV_ITEMS}>
      <Outlet context={{ restaurant } satisfies OwnerContext} />
    </DashboardLayout>
  );
}
