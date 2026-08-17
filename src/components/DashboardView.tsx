import { ArrowRight, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ProjectSubmission, GeneratedReport } from '@/types';
import { formatDate } from '@/lib/storage';
import type { View } from './Sidebar';
import StatsOverview from './StatsOverview';

interface DashboardViewProps {
  submissions: ProjectSubmission[];
  reports: Record<string, GeneratedReport>;
  onNavigate: (view: View) => void;
  onGenerate: (item: ProjectSubmission) => void;
  onViewReport: (item: ProjectSubmission) => void;
}

export default function DashboardView({
  submissions,
  reports,
  onNavigate,
  onGenerate,
  onViewReport,
}: DashboardViewProps) {
  const recent = [...submissions].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-800 via-primary-900 to-ink-900 p-6 text-white shadow-lift sm:p-8">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent-400/10 blur-2xl" />
        <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-primary-400/20 blur-2xl" />
        <div className="relative">
          <span className="badge bg-white/10 text-accent-300">
            <Sparkles className="h-3 w-3" />
            AI-Powered Report Generation
          </span>
          <h2 className="mt-3 font-serif text-2xl font-bold leading-tight sm:text-3xl">
            Kakatiya University<br className="hidden sm:block" /> Project Report Generator
          </h2>
          <p className="mt-2 max-w-lg text-sm text-primary-200 sm:text-base">
            Submit your topic, then let Google Gemini generate the full report chapter-by-chapter in
            formal Indian academic style. No token limits, no hassle.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('create')}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-400 px-5 py-2.5 text-sm font-bold text-ink-900 shadow-soft transition-all hover:bg-accent-300 hover:shadow-lift active:scale-[0.98]"
            >
              <FileText className="h-4 w-4" />
              Start a New Project
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
            >
              View My Reports
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsOverview submissions={submissions} onNavigate={onNavigate} />

      {/* Recent submissions */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-ink-900">Recent Submissions</h3>
          {submissions.length > 0 && (
            <button
              onClick={() => onNavigate('reports')}
              className="btn-ghost text-primary-700 hover:bg-primary-50 hover:text-primary-800"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <FileText className="h-7 w-7 text-primary-400" />
            </div>
            <p className="mt-3 font-semibold text-ink-800">No submissions yet</p>
            <p className="mt-1 text-sm text-ink-500">
              Your recently submitted project topics will show up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {recent.map((item) => {
              const hasReport = !!reports[item.id];
              return (
                <div
                  key={item.id}
                  className="card group p-4 transition-all hover:shadow-soft hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        item.course === 'B.Tech'
                          ? 'bg-success-50 text-success-600'
                          : 'bg-accent-50 text-accent-600'
                      }`}
                    >
                      <FileText className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-semibold text-ink-900">{item.projectTopic}</h4>
                        {hasReport && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-success-500" />
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-ink-500">
                        {item.studentName} · {item.course}
                      </p>
                      <p className="mt-1 text-xs font-medium text-ink-400">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {hasReport ? (
                      <button
                        onClick={() => onViewReport(item)}
                        className="btn-ghost flex-1 text-primary-700 hover:bg-primary-50"
                      >
                        <Eye className="h-4 w-4" />
                        View Report
                      </button>
                    ) : (
                      <button
                        onClick={() => onGenerate(item)}
                        className="btn-ghost flex-1 text-primary-700 hover:bg-primary-50"
                      >
                        <Sparkles className="h-4 w-4" />
                        Generate Report
                      </button>
                    )}
                    <button
                      onClick={() => onNavigate('reports')}
                      className="btn-ghost"
                      aria-label="Go to reports"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Eye({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
