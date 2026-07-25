import { ThemeToggle } from '@components/ui/ThemeToggle';
import { Link } from 'react-router-dom';

function scrollToExperience(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function LandingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-bg-subtle/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">
            QT
          </span>
          <span className="text-sm font-semibold text-text">QuickTable</span>
        </div>

        <nav className="hidden items-center gap-8 sm:flex">
          <a
            href="#experience"
            onClick={scrollToExperience}
            className="text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Experience the platform
          </a>
          <Link
            to="/demo/customer"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Order as a Customer
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/login"
            className="hidden rounded-full bg-text px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
