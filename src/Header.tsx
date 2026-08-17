import { GraduationCap, Menu, Settings } from 'lucide-react';
import type { View } from './Sidebar';

interface HeaderProps {
  active: View;
  onNavigate: (view: View) => void;
  onToggleMobileNav: () => void;
  onOpenSettings: () => void;
}

const TITLES: Record<View, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your project reports' },
  create: { title: 'New Project', subtitle: 'Submit a new project report topic' },
  reports: { title: 'My Reports', subtitle: 'View and manage your submitted topics' },
  generate: { title: 'Generate Report', subtitle: 'AI-powered chapter-by-chapter generation' },
  viewer: { title: 'Report Viewer', subtitle: 'Read your generated project report' },
};

export default function Header({ active, onNavigate, onToggleMobileNav, onOpenSettings }: HeaderProps) {
  const { title, subtitle } = TITLES[active];

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-white/80 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-serif text-lg font-bold text-ink-900 sm:text-xl">{title}</h1>
            <p className="hidden text-sm text-ink-500 sm:block">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSettings}
            className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={() => onNavigate('create')}
            className="btn-primary !px-3.5 !py-2 !text-xs sm:!text-sm"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">New Project</span>
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-800 text-sm font-bold text-white shadow-soft">
            KU
          </div>
        </div>
      </div>
    </header>
  );
}
