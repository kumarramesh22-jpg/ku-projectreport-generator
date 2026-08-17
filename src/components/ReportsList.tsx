import { FileText, Trash2, Eye, FolderOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ProjectSubmission, GeneratedReport } from '@/types';
import { formatDate } from '@/lib/storage';

interface ReportsListProps {
  submissions: ProjectSubmission[];
  reports: Record<string, GeneratedReport>;
  onView: (item: ProjectSubmission) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onGenerate: (item: ProjectSubmission) => void;
  onViewReport: (item: ProjectSubmission) => void;
}

export default function ReportsList({
  submissions,
  reports,
  onView,
  onDelete,
  onNew,
  onGenerate,
  onViewReport,
}: ReportsListProps) {
  if (submissions.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100">
          <FolderOpen className="h-8 w-8 text-ink-400" />
        </div>
        <h3 className="mt-4 font-serif text-lg font-semibold text-ink-800">No reports yet</h3>
        <p className="mt-1 max-w-sm text-sm text-ink-500">
          Submit your first project topic to get started. It will appear here once saved.
        </p>
        <button onClick={onNew} className="btn-primary mt-5">
          <FileText className="h-4 w-4" />
          Create New Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {submissions.map((item) => {
        const hasReport = !!reports[item.id];
        return (
          <div
            key={item.id}
            className="card group flex flex-col gap-3 p-4 transition-all hover:shadow-soft sm:flex-row sm:items-center sm:gap-4 sm:p-5"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                item.course === 'B.Tech'
                  ? 'bg-success-50 text-success-600'
                  : 'bg-accent-50 text-accent-600'
              }`}
            >
              <FileText className="h-5 w-5" strokeWidth={2.2} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-semibold text-ink-900">{item.projectTopic}</h3>
                <span
                  className={`badge ${
                    item.course === 'B.Tech'
                      ? 'bg-success-100 text-success-700'
                      : 'bg-accent-100 text-accent-700'
                  }`}
                >
                  {item.course}
                </span>
                {hasReport && (
                  <span className="badge bg-primary-100 text-primary-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Generated
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-sm text-ink-500">
                {item.studentName} · {item.hallTicketNumber} · {item.specialization}
              </p>
            </div>

            <div className="hidden shrink-0 text-right sm:block">
              <p className="text-xs font-medium text-ink-400">Submitted</p>
              <p className="text-sm font-semibold text-ink-600">{formatDate(item.createdAt)}</p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {hasReport ? (
                <button
                  onClick={() => onViewReport(item)}
                  className="btn-ghost text-primary-700 hover:bg-primary-50 hover:text-primary-800"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden md:inline">View Report</span>
                </button>
              ) : (
                <button
                  onClick={() => onGenerate(item)}
                  className="btn-ghost text-primary-700 hover:bg-primary-50 hover:text-primary-800"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden md:inline">Generate</span>
                </button>
              )}
              <button
                onClick={() => onView(item)}
                className="btn-ghost"
                aria-label={`View details for ${item.projectTopic}`}
              >
                <FileText className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-danger-50 hover:text-danger-600"
                aria-label={`Delete ${item.projectTopic}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
