import { HeroSection } from '@features/landing/components/HeroSection';
import { LandingNav } from '@features/landing/components/LandingNav';
import { RealtimeTip } from '@features/landing/components/RealtimeTip';
import { RoleCard } from '@features/landing/components/RoleCard';
import { ChefHat, LayoutDashboard, ShieldCheck, UtensilsCrossed, Users } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-subtle">
      <LandingNav />

      <main className="bg-noise">
        <div className="mx-auto max-w-[1400px] px-6 pb-20 pt-14 sm:px-10 sm:pt-20">
          <HeroSection />

          <div className="mt-16">
            <RealtimeTip />
          </div>
        </div>

        <div id="experience" className="mx-auto max-w-[1400px] px-6 pb-24 pt-4 sm:px-10">
          <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-wide text-text-muted">
            Experience the platform
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <RoleCard
              icon={UtensilsCrossed}
              title="Customer Demo"
              description="Browse Bella Italia, scan a table's QR code, order, and track it live — no account needed."
              ctaLabel="Start ordering"
              to="/demo/customer"
            />
            <RoleCard
              icon={LayoutDashboard}
              title="Restaurant Owner"
              description="Full dashboard — orders, menu, analytics, staff, coupons."
              ctaLabel="Sign in"
              to="/login"
            />
            <RoleCard
              icon={ChefHat}
              title="Kitchen Display"
              description="Full-screen, touch-friendly board for accepting and preparing orders."
              ctaLabel="Sign in"
              to="/login"
            />
            <RoleCard
              icon={Users}
              title="Waiter"
              description="Dining-room control — live table status, guest requests, and closing out the bill."
              ctaLabel="Sign in"
              to="/login"
            />
            <RoleCard
              icon={ShieldCheck}
              title="Platform Admin"
              description="Multi-tenant oversight — every restaurant, owner, and platform metric."
              ctaLabel="Sign in"
              to="/login"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
