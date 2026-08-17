import { X, GraduationCap, Hash, BookOpen, User, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ProjectSubmission, GeneratedReport } from '@/types';
import { formatDateTime } from '@/lib/storage';

interface ReportModalProps {
  report: ProjectSubmission | null;
  hasGeneratedReport: boolean;
  onClose: () => void;
  onGenerate: () => void;
  onViewReport: () => void;
}

export default function ReportModal({
  report,
  hasGeneratedReport,
  onClose,
  onGenerate,
  onViewReport,
}: ReportModalProps) {
  if (!report) return null;

  const fields = [
    { icon: User, label: 'Student Name', value: report.studentName },
    { icon: Hash, label: 'Hall Ticket Number', value: report.hallTicketNumber },
    { icon: GraduationCap, label: 'Course', value: report.course },
    { icon: BookOpen, label: 'Specialization', value: report.specialization },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="card animate-scale-in w-full max-w-lg overflow-hidden rounded-b-none sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-gradient-to-br from-primary-800 to-primary-900 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <GraduationCap className="h-6 w-6 text-accent-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-primary-200">Project Report</p>
              <h2 className="font-serif text-base font-semibold">Kakatiya University</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600">Project Topic</p>
            <p className="mt-1 font-serif text-lg font-semibold leading-snug text-ink-900">
              {report.projectTopic}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label} className="rounded-xl border border-ink-100 bg-ink-50/50 p-3">
                  <div className="flex items-center gap-2 text-ink-400">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">{field.label}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ink-800">{field.value}</p>
                </div>
              );
            })}
          </div>

          {hasGeneratedReport && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-success-200 bg-success-50 p-3 text-sm text-success-700">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-semibold">Full report generated</span>
              <span className="text-success-600">— {report.course === 'MBA' ? '5' : '6'} chapters ready</span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
            <Calendar className="h-4 w-4" />
            <span>Created on {formatDateTime(report.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-ink-100 px-6 py-4">
          <button onClick={onClose} className="btn-secondary flex-1">
            Close
          </button>
          {hasGeneratedReport ? (
            <button onClick={onViewReport} className="btn-primary flex-1">
              <Eye className="h-4 w-4" />
              View Full Report
            </button>
          ) : (
            <button onClick={onGenerate} className="btn-primary flex-1">
              <Sparkles className="h-4 w-4" />
              Generate Report
            </button>
          )}
        </div>
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
