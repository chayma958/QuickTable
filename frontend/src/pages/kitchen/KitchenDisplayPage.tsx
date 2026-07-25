import { KitchenColumn } from '@features/kitchen/components/KitchenColumn';
import { KitchenOrderCard } from '@features/kitchen/components/KitchenOrderCard';
import { NotifyWaiterModal } from '@features/kitchen/components/NotifyWaiterModal';
import { useKitchenDisplay } from '@features/kitchen/hooks/useKitchenDisplay';
import { KitchenLayout } from '@layouts/KitchenLayout/KitchenLayout';

export function KitchenDisplayPage() {
  const {
    restaurant,
    isLoading,
    incoming,
    preparing,
    ready,
    setStatus,
    notifyOrder,
    openNotify,
    closeNotify,
    isSendingNote,
    sendNote,
  } = useKitchenDisplay();

  if (isLoading || !restaurant) {
    return (
      <KitchenLayout title="Kitchen">
        <div className="grid h-full grid-cols-3">
          {['Incoming', 'Preparing', 'Ready'].map((title) => (
            <div key={title} className="border-r border-white/[0.08] p-4 last:border-r-0">
              <div className="mb-4 h-5 w-24 animate-pulse rounded bg-white/10" />
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="mb-4 rounded-xl border border-slate-700 bg-slate-800 p-5">
                  <div className="mb-3 h-5 w-16 animate-pulse rounded bg-white/10" />
                  <div className="mb-2 h-4 w-full animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </KitchenLayout>
    );
  }

  return (
    <KitchenLayout title={restaurant.name}>
      <div className="grid h-full grid-cols-3">
        <KitchenColumn title="Incoming" count={incoming.length} isEmpty={incoming.length === 0}>
          {incoming.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              actionLabel="Accept"
              onAction={() => setStatus(order.id, 'CONFIRMED')}
              onNotifyWaiter={() => openNotify(order)}
            />
          ))}
        </KitchenColumn>

        <KitchenColumn title="Preparing" count={preparing.length} isEmpty={preparing.length === 0}>
          {preparing.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              actionLabel={order.status === 'CONFIRMED' ? 'Start preparing' : 'Ready'}
              onAction={() => setStatus(order.id, order.status === 'CONFIRMED' ? 'PREPARING' : 'READY')}
              onNotifyWaiter={() => openNotify(order)}
            />
          ))}
        </KitchenColumn>

        <KitchenColumn title="Ready" count={ready.length} isEmpty={ready.length === 0}>
          {ready.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              actionLabel={null}
              onAction={() => {}}
              onNotifyWaiter={() => openNotify(order)}
            />
          ))}
        </KitchenColumn>
      </div>

      {notifyOrder && (
        <NotifyWaiterModal
          order={notifyOrder}
          isSending={isSendingNote}
          onClose={closeNotify}
          onSend={sendNote}
        />
      )}
    </KitchenLayout>
  );
}
