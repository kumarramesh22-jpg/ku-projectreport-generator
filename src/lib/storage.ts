import type { ProjectSubmission, GeneratedReport } from '@/types';

const SUBMISSIONS_KEY = 'ku_project_submissions';
const REPORTS_KEY = 'ku_generated_reports';
const API_KEY_STORAGE = 'ku_gemini_api_key';

export function loadSubmissions(): ProjectSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ProjectSubmission[];
  } catch {
    return [];
  }
}

export function saveSubmissions(items: ProjectSubmission[]): void {
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(items));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function createSubmission(
  data: Omit<ProjectSubmission, 'id' | 'createdAt' | 'updatedAt'>
): ProjectSubmission {
  const now = Date.now();
  return {
    ...data,
    id: `${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
}

export function loadReports(): Record<string, GeneratedReport> {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed as Record<string, GeneratedReport>;
  } catch {
    return {};
  }
}

export function saveReport(report: GeneratedReport): void {
  try {
    const all = loadReports();
    all[report.submissionId] = report;
    localStorage.setItem(REPORTS_KEY, JSON.stringify(all));
  } catch {
    // storage full — silently ignore
  }
}

export function deleteReport(submissionId: string): void {
  try {
    const all = loadReports();
    delete all[submissionId];
    localStorage.setItem(REPORTS_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function loadApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE) ?? '';
  } catch {
    return '';
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(API_KEY_STORAGE, key);
  } catch {
    // ignore
  }
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
