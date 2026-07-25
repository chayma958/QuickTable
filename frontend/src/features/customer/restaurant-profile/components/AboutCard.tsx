import { ChefHat } from 'lucide-react';

export function AboutCard({ description }: { description: string | null }) {
  if (!description) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-soft sm:p-10">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand-dark">
        <ChefHat size={26} />
      </div>
      <h2 className="mb-3 text-xl font-bold text-text">Our Story</h2>
      <p className="mx-auto max-w-xl text-[1.0625rem] leading-relaxed text-text-muted">{description}</p>
    </div>
  );
}
