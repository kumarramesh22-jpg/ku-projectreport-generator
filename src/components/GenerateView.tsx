import { Sparkles, Loader2, CheckCircle2, AlertCircle, Lock, FileText, ArrowRight } from 'lucide-react';
import type { ProjectSubmission } from '@/types';
import { getChapters } from '@/lib/chapters';
import type { ChapterProgress } from '@/hooks/useReportGenerator';
import type { View } from './Sidebar';

interface GenerateViewProps {
  submission: ProjectSubmission | null;
  isGenerating: boolean;
  progress: ChapterProgress[];
  error: string | null;
  hasApiKey: boolean;
  onStart: () => void;
  onAbort: () => void;
  onOpenSettings: () => void;
  onNavigate: (view: View) => void;
  onViewReport: () => void;
  hasReport: boolean;
}

export default function GenerateView({
  submission,
  isGenerating,
  progress,
  error,
  hasApiKey,
  onStart,
  onAbort,
  onOpenSettings,
  onNavigate,
  onViewReport,
  hasReport,
}: GenerateViewProps) {
  if (!submission) {
    return (
      <div className="card flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100">
          <FileText className="h-8 w-8 text-ink-400" />
        </div>
        <h3 className="mt-4 font-serif text-lg font-semibold text-ink-800">No project selected</h3>
        <p className="mt-1 max-w-sm text-sm text-ink-500">
          Submit a project topic first, then come here to generate the full report.
        </p>
        <button onClick={() => onNavigate('create')} className="btn-primary mt-5">
          <FileText className="h-4 w-4" />
          Create a Project
        </button>
      </div>
    );
  }

  const chapters = getChapters(submission.course);

  return (
    <div className="mx-auto max-w-3xl space-y-5 animate-fade-in">
      {/* Project info card */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary-800 to-primary-900 px-5 py-4 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Sparkles className="h-5 w-5 text-accent-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-primary-200">Generating report for</p>
            <h2 className="truncate font-serif text-base font-semibold">{submission.projectTopic}</h2>
          </div>
          <span
            className={`badge ${submission.course === 'B.Tech' ? 'bg-success-100 text-success-700' : 'bg-accent-100 text-accent-700'}`}
          >
            {submission.course}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
          <InfoCell label="Student" value={submission.studentName} />
          <InfoCell label="Hall Ticket" value={submission.hallTicketNumber} />
          <InfoCell label="Specialization" value={submission.specialization} />
        </div>
      </div>

      {/* API key warning */}
      {!hasApiKey && (
        <div className="card flex flex-col items-center gap-3 border-accent-200 bg-accent-50 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
            <Lock className="h-6 w-6 text-accent-600" />
          </div>
          <h3 className="font-serif text-base font-semibold text-ink-800">Gemini API Key Required</h3>
          <p className="max-w-sm text-sm text-ink-600">
            You need a free Google Gemini API key to generate report chapters. It takes less than a
            minute to get one.
          </p>
          <button onClick={onOpenSettings} className="btn-primary">
            <KeyIcon />
            Add Your API Key
          </button>
        </div>
      )}

      {/* Chapter outline */}
      {hasApiKey && !isGenerating && progress.length === 0 && !error && (
        <div className="card p-5 sm:p-6">
          <h3 className="font-serif text-lg font-semibold text-ink-900">
            Report Structure — {chapters.length} Chapters
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            Each chapter will be generated sequentially by Gemini to ensure quality and avoid token
            limits. The formal Indian academic tone is applied throughout.
          </p>
          <div className="mt-4 space-y-2">
            {chapters.map((ch) => (
              <div
                key={ch.number}
                className="flex items-start gap-3 rounded-xl border border-ink-100 bg-ink-50/50 p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-700">
                  {ch.number}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-800">
                    Chapter {ch.number}: {ch.title}
                  </p>
                  <p className="text-xs text-ink-500">{ch.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {hasReport && (
              <button onClick={onViewReport} className="btn-secondary">
                <FileText className="h-4 w-4" />
                View Existing Report
              </button>
            )}
            <button onClick={onStart} className="btn-primary w-full sm:w-auto">
              <Sparkles className="h-4 w-4" />
              {hasReport ? 'Regenerate Full Report' : 'Generate Full Report'}
            </button>
          </div>
        </div>
      )}

      {/* Generation progress */}
      {(isGenerating || progress.length > 0) && (
        <div className="card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-ink-900">Generation Progress</h3>
            {isGenerating && (
              <button onClick={onAbort} className="btn-ghost text-danger-600 hover:bg-danger-50">
                Stop
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {progress.map((p) => (
              <ChapterRow key={p.number} progress={p} total={chapters.length} />
            ))}
          </div>

          {isGenerating && (
            <div className="mt-4 flex items-center gap-2 text-sm text-ink-500">
              <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
              Generating chapter {progress.findIndex((p) => p.status === 'generating') + 1} of {chapters.length}...
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card flex items-start gap-3 border-danger-200 bg-danger-50 p-5">
          <AlertCircle className="h-5 w-5 shrink-0 text-danger-600" />
          <div>
            <p className="text-sm font-semibold text-danger-800">Generation Error</p>
            <p className="mt-0.5 text-sm text-danger-600">{error}</p>
          </div>
        </div>
      )}

      {/* Success + view */}
      {!isGenerating && progress.length > 0 && progress.every((p) => p.status === 'done') && !error && (
        <div className="card flex flex-col items-center gap-3 border-success-200 bg-success-50 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-100">
            <CheckCircle2 className="h-6 w-6 text-success-600" />
          </div>
          <h3 className="font-serif text-base font-semibold text-ink-800">Report Generated Successfully</h3>
          <p className="max-w-sm text-sm text-ink-600">
            All {chapters.length} chapters have been generated and saved. You can view the complete
            report now.
          </p>
          <button onClick={onViewReport} className="btn-primary mt-1">
            <FileText className="h-4 w-4" />
            View Full Report
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-ink-800">{value}</p>
    </div>
  );
}

function ChapterRow({ progress, total }: { progress: ChapterProgress; total: number }) {
  const pct = (progress.number / total) * 100;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
        progress.status === 'generating'
          ? 'border-primary-200 bg-primary-50/50'
          : progress.status === 'done'
            ? 'border-success-200 bg-success-50/40'
            : progress.status === 'error'
              ? 'border-danger-200 bg-danger-50/40'
              : 'border-ink-100 bg-ink-50/30'
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
          progress.status === 'done'
            ? 'bg-success-100 text-success-700'
            : progress.status === 'generating'
              ? 'bg-primary-100 text-primary-700'
              : progress.status === 'error'
                ? 'bg-danger-100 text-danger-700'
                : 'bg-ink-100 text-ink-400'
        }`}
      >
        {progress.status === 'done' ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : progress.status === 'generating' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : progress.status === 'error' ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          progress.number
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink-800">
          {progress.title || `Chapter ${progress.number}`}
        </p>
        <p className="text-xs text-ink-500">
          {progress.status === 'generating'
            ? 'Generating...'
            : progress.status === 'done'
              ? 'Completed'
              : progress.status === 'error'
                ? 'Failed'
                : 'Waiting'}
        </p>
      </div>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-200">
        <div
          className={`h-full transition-all duration-500 ${
            progress.status === 'done'
              ? 'w-full bg-success-500'
              : progress.status === 'generating'
                ? 'w-1/2 bg-primary-500'
                : progress.status === 'error'
                  ? 'w-full bg-danger-500'
                  : 'w-0 bg-ink-300'
          }`}
          style={{ width: progress.status === 'done' ? '100%' : progress.status === 'generating' ? `${pct}%` : progress.status === 'error' ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
}

function KeyIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 16.5l-1.5 1.5-1.5-1.5-1.5 1.5-1.5-1.5 1.5-1.5L3 12.75l.43-.43c.404-.404.527-1 .43-1.563A6 6 0 1 1 15.75 5.25Z" />
      <circle cx="15.75" cy="8.25" r="1.5" fill="currentColor" />
    </svg>
  );
}
