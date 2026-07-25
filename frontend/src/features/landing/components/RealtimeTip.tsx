import { Sparkles } from 'lucide-react';

export function RealtimeTip() {
  return (
    <p className="mx-auto flex max-w-2xl items-start gap-2.5 text-left text-sm leading-relaxed text-text-muted">
      <Sparkles size={16} className="mt-0.5 shrink-0 text-brand" />
      <span>
        <span className="font-semibold text-text">Best experience:</span> open multiple roles in separate tabs. 
        Sign in with the provided Kitchen and Waiter demo accounts, then place an order as the Customer to watch 
        it instantly appear in the Kitchen Display, update the Waiter Dashboard, and trigger live notifications—all 
        powered by a shared real-time backend.
      </span>
    </p>
  );
}
