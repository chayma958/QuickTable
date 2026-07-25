import { DEMO_RESTAURANT_SLUG } from '@features/customer/restaurant-profile/hooks/useRestaurantProfile';
import { useGuestSession } from '@features/customer/restaurant-profile/hooks/useGuestSession';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEMO_TABLE_NUMBER = 1;
const SCAN_PHASE_MS = 1100;
const SESSION_PHASE_MS = 700;

type Phase = 'scanning' | 'session-created';

export function QrScanDemoPage() {
  const navigate = useNavigate();
  const { ensureGuestSession } = useGuestSession();
  const [phase, setPhase] = useState<Phase>('scanning');

  useEffect(() => {
    const toSessionCreated = setTimeout(() => {
      ensureGuestSession();
      setPhase('session-created');
    }, SCAN_PHASE_MS);

    const toMenu = setTimeout(() => {
      navigate(`/r/${DEMO_RESTAURANT_SLUG}/table/${DEMO_TABLE_NUMBER}`, { replace: true });
    }, SCAN_PHASE_MS + SESSION_PHASE_MS);

    return () => {
      clearTimeout(toSessionCreated);
      clearTimeout(toMenu);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg-subtle px-6 text-center">
      <AnimatePresence mode="wait">
        {phase === 'scanning' ? (
          <motion.div
            key="scanning"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative flex h-32 w-32 items-center justify-center rounded-[1.75rem] bg-surface shadow-elevated"
          >
            <QrCode size={56} className="text-text" strokeWidth={1.5} />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: '100%' }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-x-3 h-0.5 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]"
            />
          </motion.div>
        ) : (
          <motion.div
            key="session-created"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex h-32 w-32 items-center justify-center rounded-[1.75rem] bg-success/15 shadow-elevated"
          >
            <CheckCircle2 size={56} className="text-success" strokeWidth={1.5} />
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <p className="text-lg font-bold text-text">
          {phase === 'scanning' ? 'Simulating QR Scan…' : 'Guest Session Created'}
        </p>
        <p className="mt-1.5 text-sm text-text-muted">Table {DEMO_TABLE_NUMBER} — Bella Italia</p>
      </div>
    </div>
  );
}
