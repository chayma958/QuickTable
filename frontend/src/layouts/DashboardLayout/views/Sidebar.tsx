import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export interface NavItem {
  label: string;
  to: string;
  icon?: LucideIcon;
  end?: boolean;
}

function SidebarContent({ title, navItems, onNavigate }: { title: string; navItems: NavItem[]; onNavigate?: () => void }) {
  return (
    <>
      <div className="mb-4 flex items-center gap-2.5 border-b border-white/10 px-2 pb-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-xs font-bold">
          QT
        </span>
        <span className="truncate text-[0.9375rem] font-semibold">{title}</span>
      </div>
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brand text-white' : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
              }`
            }
          >
            {item.icon && <item.icon size={16} />}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export function Sidebar({
  title,
  navItems,
  isMobileOpen,
  onCloseMobile,
}: {
  title: string;
  navItems: NavItem[];
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <aside className="hidden w-60 shrink-0 flex-col bg-[#111110] px-4 py-5 text-white md:flex">
        <SidebarContent title={title} navItems={navItems} />
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={onCloseMobile}
          >
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="flex h-full w-60 flex-col bg-[#111110] px-4 py-5 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent title={title} navItems={navItems} onNavigate={onCloseMobile} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
