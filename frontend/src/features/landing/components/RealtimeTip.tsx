import { Sparkles } from 'lucide-react';

export function RealtimeTip() {
  return (
    <p className="mx-auto flex max-w-2xl items-start gap-2.5 text-left text-sm leading-relaxed text-text-muted">
      <Sparkles size={16} className="mt-0.5 shrink-0 text-brand" />
      <span>
        <span className="font-semibold text-text">Best experience:</span> open a few of these in separate
        tabs — use the Demo Accounts on the sign-in screen for Kitchen and Waiter — then place an order as the
        Customer and watch it hit Kitchen instantly, flip the table to "Food ready" on Waiter, and land as a
        live notification when you try "Call a waiter", all in real time.
      </span>
    </p>
  );
}
