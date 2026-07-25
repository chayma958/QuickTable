import { LiveOrderSimulation } from '@features/landing/components/LiveOrderSimulation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-text-muted"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Live demo &mdash; no account needed
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-[3.25rem]"
        >
          Complete restaurant
          <br />
          management platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-lg text-text-muted lg:mx-0"
        >
          QuickTable runs the whole loop &mdash; QR ordering, kitchen display, dining-room
          management, and platform administration &mdash; on one real-time backend.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
        >
          <Link
            to="/demo/customer"
            className="group inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:w-auto"
          >
            Try the live demo
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-text transition-colors hover:bg-bg-subtle sm:w-auto"
          >
            Staff sign in
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <LiveOrderSimulation />
      </motion.div>
    </div>
  );
}
