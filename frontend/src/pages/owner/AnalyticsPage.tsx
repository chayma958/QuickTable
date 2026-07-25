import { RevenueChart } from '@features/owner/analytics/components/RevenueChart';
import { TopDishesChart } from '@features/owner/analytics/components/TopDishesChart';
import { useAnalyticsPage } from '@features/owner/analytics/hooks/useAnalyticsPage';
import { StatTile } from '@features/owner/dashboard/components/StatTile';
import { useOwnerContext } from '@layouts/OwnerShell';
import { CheckCircle2, Repeat, Timer } from 'lucide-react';

export function AnalyticsPage() {
  const { restaurant } = useOwnerContext();
  const { analytics, daysToShow } = useAnalyticsPage(restaurant.id);

  return (
    <div>
      <h1 className="mb-5 text-[1.375rem] font-bold text-text">Analytics</h1>

      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        <StatTile label="Order completion rate" value={`${analytics.completionRate.toFixed(0)}%`} icon={CheckCircle2} />
        <StatTile label="Avg. preparation time" value={`${analytics.avgPrepMinutes.toFixed(0)} min`} icon={Timer} />
        <StatTile label="Repeat customers" value={`${analytics.repeatRate.toFixed(0)}%`} icon={Repeat} />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-5">
        <div className="rounded-xl border border-border bg-bg p-5">
          <div className="mb-3 text-[0.9375rem] font-bold text-text">Revenue — last {daysToShow} days</div>
          <RevenueChart data={analytics.revenueSeries} />
        </div>
        <div className="rounded-xl border border-border bg-bg p-5">
          <div className="mb-3 text-[0.9375rem] font-bold text-text">Most sold items</div>
          {analytics.topDishes.length === 0 ? (
            <p className="text-sm text-text-muted">No orders yet.</p>
          ) : (
            <TopDishesChart data={analytics.topDishes} />
          )}
        </div>
        <div className="rounded-xl border border-border bg-bg p-5">
          <div className="mb-3 text-[0.9375rem] font-bold text-text">Revenue by waiter</div>
          {analytics.revenueByWaiter.length === 0 ? (
            <p className="text-sm text-text-muted">No delivered orders yet.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {analytics.revenueByWaiter.map((row) => (
                <div key={row.name} className="flex items-center justify-between text-sm">
                  <span className="text-text">{row.name}</span>
                  <span className="font-semibold text-text">${row.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
