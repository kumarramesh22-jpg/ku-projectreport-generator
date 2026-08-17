import { GraduationCap, LayoutDashboard, FilePlus2, FileText, Settings, Sparkles } from 'lucide-react';

export type View = 'dashboard' | 'create' | 'reports' | 'generate' | 'viewer';

interface SidebarProps {
  active: View;
  onNavigate: (view: View) => void;
  reportCount: number;
  onOpenSettings: () => void;
}

const NAV_ITEMS: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'create', label: 'New Project', icon: FilePlus2 },
  { id: 'reports', label: 'My Reports', icon: FileText },
];

export default function Sidebar({ active, onNavigate, reportCount, onOpenSettings }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-200/70 bg-white lg:flex">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-800 shadow-soft">
          <GraduationCap className="h-6 w-6 text-accent-400" strokeWidth={2.2} />
        </div>
        <div className="leading-tight">
          <p className="font-serif text-base font-semibold text-primary-900">Kakatiya University</p>
          <p className="text-xs font-medium text-ink-400">Project Reports</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink-400">Menu</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-800'
                  : 'text-ink-500 hover:bg-ink-50 hover:text-ink-700'
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${isActive ? 'text-primary-700' : 'text-ink-400 group-hover:text-ink-600'}`}
                strokeWidth={2}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'reports' && reportCount > 0 && (
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-bold text-primary-700">
                  {reportCount}
                </span>
              )}
              {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />}
            </button>
          );
        })}

        {active === 'generate' && (
          <button
            onClick={() => onNavigate('generate')}
            className="group flex w-full items-center gap-3 rounded-xl bg-primary-50 px-3 py-2.5 text-sm font-medium text-primary-800"
          >
            <Sparkles className="h-5 w-5 text-primary-700" strokeWidth={2} />
            <span className="flex-1 text-left">Generate Report</span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
          </button>
        )}
      </nav>

      <div className="px-3 py-4">
        <button
          onClick={onOpenSettings}
          className="card flex w-full items-center gap-3 p-4 text-left transition-all hover:shadow-soft"
        >
          <Settings className="h-5 w-5 text-primary-700" />
          <div>
            <p className="text-sm font-semibold text-ink-800">Gemini API Key</p>
            <p className="text-xs text-ink-500">Configure AI settings</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
