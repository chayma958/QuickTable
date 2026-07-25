import { ArrowRight } from 'lucide-react';

export function BottomOrderCTA({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-[1.75rem] bg-brand-light p-8 text-center sm:p-12">
      <h2 className="mb-2.5 text-2xl font-extrabold text-brand-dark sm:text-3xl">Ready to order?</h2>
      <p className="mx-auto mb-7 max-w-md text-[0.9375rem] leading-relaxed text-brand-dark/80">
        Experience the complete QR ordering flow exactly as customers would inside the restaurant.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center gap-2.5 rounded-2xl bg-brand px-7 py-4 text-base font-bold text-white shadow-elevated transition-colors hover:bg-brand-dark"
      >
        Start Demo Ordering
        <ArrowRight size={17} />
      </button>
    </div>
  );
}
