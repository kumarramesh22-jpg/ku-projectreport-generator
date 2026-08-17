import { useState, useCallback, useEffect } from 'react';
import Sidebar, { type View } from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardView from '@/components/DashboardView';
import ProjectForm from '@/components/ProjectForm';
import ReportsList from '@/components/ReportsList';
import ReportModal from '@/components/ReportModal';
import GenerateView from '@/components/GenerateView';
import ReportViewer from '@/components/ReportViewer';
import SettingsModal from '@/components/SettingsModal';
import ToastContainer, { type Toast } from '@/components/ToastContainer';
import {
  loadSubmissions,
  saveSubmissions,
  createSubmission,
  loadReports,
  deleteReport,
  loadApiKey,
} from '@/lib/storage';
import { useReportGenerator } from '@/hooks/useReportGenerator';
import { getChapterCount } from '@/lib/chapters';
import type { ProjectSubmission, Course, GeneratedReport } from '@/types';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [reports, setReports] = useState<Record<string, GeneratedReport>>({});
  const [activeReport, setActiveReport] = useState<ProjectSubmission | null>(null);
  const [generateTarget, setGenerateTarget] = useState<ProjectSubmission | null>(null);
  const [viewerTarget, setViewerTarget] = useState<ProjectSubmission | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const generator = useReportGenerator();

  useEffect(() => {
    setSubmissions(loadSubmissions());
    setReports(loadReports());
    setApiKey(loadApiKey());
  }, []);

  const persist = useCallback((items: ProjectSubmission[]) => {
    setSubmissions(items);
    saveSubmissions(items);
  }, []);

  const pushToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSubmit = useCallback(
    (data: {
      studentName: string;
      hallTicketNumber: string;
      course: Course;
      specialization: string;
      projectTopic: string;
    }) => {
      const submission = createSubmission(data);
      const updated = [submission, ...submissions];
      persist(updated);
      pushToast('Project topic submitted successfully.');
      setView('reports');
    },
    [submissions, persist, pushToast]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const updated = submissions.filter((s) => s.id !== id);
      persist(updated);
      deleteReport(id);
      setReports((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setActiveReport(null);
      pushToast('Report deleted.', 'error');
    },
    [submissions, persist, pushToast]
  );

  const navigate = useCallback((next: View) => {
    setView(next);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenGenerate = useCallback((item: ProjectSubmission) => {
    setGenerateTarget(item);
    setActiveReport(null);
    navigate('generate');
  }, [navigate]);

  const handleStartGeneration = useCallback(async () => {
    if (!generateTarget) return;
    if (!apiKey.trim()) {
      setSettingsOpen(true);
      return;
    }
    const total = getChapterCount(generateTarget.course);
    await generator.generate(apiKey, {
      studentName: generateTarget.studentName,
      hallTicketNumber: generateTarget.hallTicketNumber,
      course: generateTarget.course,
      specialization: generateTarget.specialization,
      projectTopic: generateTarget.projectTopic,
    }, total);

    // After generation, reload reports from storage
    setReports(loadReports());
    if (!generator.error) {
      pushToast('Report generated successfully!');
    }
  }, [generateTarget, apiKey, generator, pushToast]);

  const handleViewReport = useCallback((item: ProjectSubmission) => {
    setViewerTarget(item);
    setActiveReport(null);
    navigate('viewer');
  }, [navigate]);

  const handleSettingsSaved = useCallback(() => {
    setApiKey(loadApiKey());
    pushToast('API key saved.');
  }, [pushToast]);

  // Determine which report to show in viewer
  const viewerReport = viewerTarget ? reports[viewerTarget.id] : null;

  return (
    <div className="flex min-h-screen bg-ink-100">
      <Sidebar
        active={view}
        onNavigate={navigate}
        reportCount={submissions.length}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileNavOpen(false)}>
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in" />
          <div
            className="absolute left-0 top-0 h-full w-64 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full">
              <Sidebar
                active={view}
                onNavigate={navigate}
                reportCount={submissions.length}
                onOpenSettings={() => {
                  setMobileNavOpen(false);
                  setSettingsOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          active={view}
          onNavigate={navigate}
          onToggleMobileNav={() => setMobileNavOpen((v) => !v)}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-5xl">
            {view === 'dashboard' && (
              <DashboardView
                submissions={submissions}
                reports={reports}
                onNavigate={navigate}
                onGenerate={handleOpenGenerate}
                onViewReport={handleViewReport}
              />
            )}
            {view === 'create' && (
              <div className="mx-auto max-w-2xl">
                <ProjectForm onSubmit={handleSubmit} />
              </div>
            )}
            {view === 'reports' && (
              <ReportsList
                submissions={submissions}
                reports={reports}
                onView={setActiveReport}
                onDelete={handleDelete}
                onNew={() => navigate('create')}
                onGenerate={handleOpenGenerate}
                onViewReport={handleViewReport}
              />
            )}
            {view === 'generate' && (
              <GenerateView
                submission={generateTarget}
                isGenerating={generator.isGenerating}
                progress={generator.progress}
                error={generator.error}
                hasApiKey={!!apiKey.trim()}
                onStart={handleStartGeneration}
                onAbort={generator.abort}
                onOpenSettings={() => setSettingsOpen(true)}
                onNavigate={navigate}
                onViewReport={() => generateTarget && handleViewReport(generateTarget)}
                hasReport={generateTarget ? !!reports[generateTarget.id] : false}
              />
            )}
            {view === 'viewer' && viewerTarget && viewerReport && (
              <ReportViewer
                report={viewerReport}
                submission={viewerTarget}
                onBack={() => navigate('reports')}
              />
            )}
            {view === 'viewer' && (!viewerTarget || !viewerReport) && (
              <div className="card flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
                <p className="text-sm text-ink-500">No generated report found for this project.</p>
                <button onClick={() => navigate('reports')} className="btn-secondary mt-4">
                  Back to Reports
                </button>
              </div>
            )}
          </div>
        </main>

        <footer className="border-t border-ink-200/70 bg-white px-6 py-4">
          <p className="text-center text-xs text-ink-400">
            Kakatiya University · Project Report Generator · AI-powered by Google Gemini
          </p>
        </footer>
      </div>

      <ReportModal
        report={activeReport}
        hasGeneratedReport={activeReport ? !!reports[activeReport.id] : false}
        onClose={() => setActiveReport(null)}
        onGenerate={() => {
          if (activeReport) handleOpenGenerate(activeReport);
        }}
        onViewReport={() => {
          if (activeReport) handleViewReport(activeReport);
        }}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSaved={handleSettingsSaved}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
