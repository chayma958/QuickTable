import { useState, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, type NavItem } from './views/Sidebar';
import { Topbar } from './views/Topbar';

export function DashboardLayout({ title, navItems, children }: {
  title: string;
  navItems: NavItem[];
  children?: ReactNode;
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        title={title}
        navItems={navItems}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
