import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RoleCard({
  icon: Icon,
  title,
  description,
  ctaLabel,
  isLoading,
  to,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  isLoading?: boolean;
  to: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={to}
        aria-disabled={isLoading}
        className="group flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-6 text-left shadow-soft transition-shadow hover:shadow-elevated aria-disabled:pointer-events-none aria-disabled:cursor-wait aria-disabled:opacity-70"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand-dark">
          <Icon size={20} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-text">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{description}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Signing in...
            </>
          ) : (
            <>
              {ctaLabel}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </span>
      </Link>
    </motion.div>
  );
}
