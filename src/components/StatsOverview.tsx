import { FileText, FilePlus2, GraduationCap, TrendingUp } from 'lucide-react';
import type { ProjectSubmission } from '@/types';
import type { View } from './Sidebar';

interface StatsOverviewProps {
  submissions: ProjectSubmission[];
  onNavigate: (view: View) => void;
}

export default function StatsOverview({ submissions, onNavigate }: StatsOverviewProps) {
  const total = submissions.length;
  const btechCount = submissions.filter((s) => s.course === 'B.Tech').length;
  const mbaCount = submissions.filter((s) => s.course === 'MBA').length;
  const recent = submissions.slice(0, 1).length > 0;

  const stats = [
    {
      label: 'Total Reports',
      value: total,
      icon: FileText,
      tint: 'bg-primary-50 text-primary-700',
      ring: 'ring-primary-100',
    },
    {
      label: 'B.Tech Projects',
      value: btechCount,
      icon: GraduationCap,
      tint: 'bg-success-50 text-success-700',
      ring: 'ring-success-100',
    },
    {
      label: 'MBA Projects',
      value: mbaCount,
      icon: TrendingUp,
      tint: 'bg-accent-50 text-accent-700',
      ring: 'ring-accent-100',
    },
    {
      label: 'Quick Action',
      value: recent ? 'Add another' : 'Start here',
      icon: FilePlus2,
      tint: 'bg-ink-100 text-ink-700',
      ring: 'ring-ink-200',
      onClick: () => onNavigate('create'),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isAction = 'onClick' in stat && stat.onClick;
        return (
          <button
            key={stat.label}
            onClick={stat.onClick}
            disabled={!isAction}
            className={`card group p-4 text-left transition-all sm:p-5 ${
              isAction ? 'cursor-pointer hover:shadow-soft hover:-translate-y-0.5' : 'cursor-default'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-4 ${stat.tint} ${stat.ring}`}>
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              {isAction && (
                <span className="text-xs font-medium text-ink-400 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              )}
            </div>
            <p className="mt-3 text-2xl font-bold text-ink-900 sm:text-3xl">{stat.value}</p>
            <p className="mt-0.5 text-xs font-medium text-ink-500 sm:text-sm">{stat.label}</p>
          </button>
        );
      })}
    </div>
  );
}
