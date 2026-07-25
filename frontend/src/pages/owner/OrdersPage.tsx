import { EmptyState } from '@components/ui/EmptyState';
import { OrderCard } from '@features/owner/orders/components/OrderCard';
import { OrderStatusTabs } from '@features/owner/orders/components/OrderStatusTabs';
import { useOrdersPage } from '@features/owner/orders/hooks/useOrdersPage';
import { useOwnerContext } from '@layouts/OwnerShell';
import { ClipboardList } from 'lucide-react';

export function OrdersPage() {
  const { restaurant } = useOwnerContext();
  const { orders, statusFilter, setStatusFilter, onStatusChange } = useOrdersPage(restaurant.id);

  return (
    <div>
      <h1 className="mb-5 text-[1.375rem] font-bold text-text">Orders</h1>
      <OrderStatusTabs active={statusFilter} onChange={setStatusFilter} />

      {orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No orders in this view" description="They'll show up here as soon as a customer places one." />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] items-start gap-3.5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusChange={(status) => onStatusChange(order.id, status)} />
          ))}
        </div>
      )}
    </div>
  );
}
