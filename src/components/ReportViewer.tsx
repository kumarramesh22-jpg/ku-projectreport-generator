import { useState } from 'react';
import { ArrowLeft, Download, BookOpen, ChevronDown, FileText } from 'lucide-react';
import type { GeneratedReport, ProjectSubmission } from '@/types';
import { formatDateTime } from '@/lib/storage';
import { downloadPdf } from '@/lib/pdf';

interface ReportViewerProps {
  report: GeneratedReport;
  submission: ProjectSubmission;
  onBack: () => void;
}

export default function ReportViewer({ report, submission, onBack }: ReportViewerProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const [mobileChapterOpen, setMobileChapterOpen] = useState(false);

  const chapters = [...report.chapters].sort((a, b) => a.number - b.number);
  const current = chapters[activeChapter] ?? chapters[0];

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  function handleDownloadMarkdown() {
    const fullText = buildFullReportText(report, submission);
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${submission.hallTicketNumber}_${submission.studentName.replace(/\s+/g, '_')}_Report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleDownloadPdf() {
    setIsGeneratingPdf(true);
    try {
      downloadPdf(report, submission);
    } finally {
      window.setTimeout(() => setIsGeneratingPdf(false), 500);
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleDownloadPdf} className="btn-primary" disabled={isGeneratingPdf}>
            <FileText className="h-4 w-4" />
            {isGeneratingPdf ? 'Generating PDF...' : 'Download as PDF'}
          </button>
          <button onClick={handleDownloadMarkdown} className="btn-secondary">
            <Download className="h-4 w-4" />
            Markdown
          </button>
        </div>
      </div>

      {/* Cover page */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-primary-800 via-primary-900 to-ink-900 px-6 py-8 text-center text-white sm:px-10 sm:py-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <BookOpen className="h-7 w-7 text-accent-400" />
          </div>
          <p className="font-serif text-sm font-medium text-primary-200">Kakatiya University, Warangal</p>
          <h1 className="mt-2 font-serif text-xl font-bold leading-tight sm:text-2xl">
            {submission.projectTopic}
          </h1>
          <p className="mt-3 text-sm text-primary-200">
            A {submission.course} Project Report submitted in partial fulfillment of the requirements
          </p>
          <div className="mx-auto mt-5 max-w-md rounded-xl bg-white/10 p-4 text-left text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-primary-200">Student:</span>
              <span className="font-semibold text-white">{submission.studentName}</span>
              <span className="text-primary-200">Hall Ticket:</span>
              <span className="font-semibold text-white">{submission.hallTicketNumber}</span>
              <span className="text-primary-200">Course:</span>
              <span className="font-semibold text-white">{submission.course}</span>
              <span className="text-primary-200">Specialization:</span>
              <span className="font-semibold text-white">{submission.specialization}</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-primary-300">
            Generated on {formatDateTime(report.generatedAt)}
          </p>
        </div>
      </div>

      {/* Chapter navigation + content */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <div className="card sticky top-20 p-3">
            <p className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-400">
              Chapters
            </p>
            <nav className="space-y-0.5">
              {chapters.map((ch, i) => (
                <button
                  key={ch.number}
                  onClick={() => setActiveChapter(i)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                    i === activeChapter
                      ? 'bg-primary-50 font-semibold text-primary-800'
                      : 'text-ink-500 hover:bg-ink-50 hover:text-ink-700'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                      i === activeChapter ? 'bg-primary-200 text-primary-800' : 'bg-ink-100 text-ink-500'
                    }`}
                  >
                    {ch.number}
                  </span>
                  <span className="line-clamp-2">{ch.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile chapter dropdown */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileChapterOpen((v) => !v)}
            className="card flex w-full items-center justify-between p-3"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-ink-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-100 text-xs font-bold text-primary-700">
                {current.number}
              </span>
              {current.title}
            </span>
            <ChevronDown className={`h-4 w-4 text-ink-400 transition-transform ${mobileChapterOpen ? 'rotate-180' : ''}`} />
          </button>
          {mobileChapterOpen && (
            <div className="card mt-1 space-y-0.5 p-2">
              {chapters.map((ch, i) => (
                <button
                  key={ch.number}
                  onClick={() => {
                    setActiveChapter(i);
                    setMobileChapterOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                    i === activeChapter
                      ? 'bg-primary-50 font-semibold text-primary-800'
                      : 'text-ink-500 hover:bg-ink-50'
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink-100 text-xs font-bold text-ink-500">
                    {ch.number}
                  </span>
                  {ch.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chapter content */}
        <div className="card min-w-0 p-5 sm:p-8">
          <div className="mb-4 border-b border-ink-100 pb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Chapter {current.number}
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold text-ink-900 sm:text-2xl">
              {current.title}
            </h2>
            <p className="mt-0.5 text-sm text-ink-500">{current.subtitle}</p>
          </div>
          <article className="prose-report">
            <MarkdownRenderer content={current.content} />
          </article>
        </div>
      </div>
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let tableBuffer: string[] = [];
  let inTable = false;

  function flushTable(key: string) {
    if (tableBuffer.length === 0) return;
    const tableHtml = renderTable(tableBuffer);
    if (tableHtml) {
      elements.push(<div key={key} className="my-4 overflow-x-auto" dangerouslySetInnerHTML={{ __html: tableHtml }} />);
    }
    tableBuffer = [];
    inTable = false;
  }

  lines.forEach((line, i) => {
    if (line.trim().startsWith('|') && line.includes('|', 1)) {
      inTable = true;
      tableBuffer.push(line);
      return;
    }
    if (inTable) {
      flushTable(`table-${i}`);
    }
    elements.push(<LineRenderer key={`line-${i}`} line={line} />);
  });
  if (inTable) flushTable('table-final');

  return <>{elements}</>;
}

function LineRenderer({ line }: { line: string }) {
  const trimmed = line.trim();

  if (trimmed === '') return <div className="h-3" />;

  // Headings
  if (trimmed.startsWith('### ')) {
    return <h3 className="mt-5 font-serif text-base font-bold text-ink-900">{inline(trimmed.slice(4))}</h3>;
  }
  if (trimmed.startsWith('## ')) {
    return <h2 className="mt-6 font-serif text-lg font-bold text-ink-900">{inline(trimmed.slice(3))}</h2>;
  }
  if (trimmed.startsWith('# ')) {
    return <h1 className="mt-6 font-serif text-xl font-bold text-ink-900">{inline(trimmed.slice(2))}</h1>;
  }

  // Bullet list
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    return (
      <ul className="my-1.5 space-y-1 pl-5">
        <li className="text-sm leading-relaxed text-ink-700 list-disc">{inline(trimmed.slice(2))}</li>
      </ul>
    );
  }

  // Numbered list
  const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
  if (numberedMatch) {
    return (
      <ol className="my-1.5 space-y-1 pl-5">
        <li className="text-sm leading-relaxed text-ink-700 list-decimal">{inline(numberedMatch[2])}</li>
      </ol>
    );
  }

  // Regular paragraph
  return <p className="text-sm leading-relaxed text-ink-700">{inline(trimmed)}</p>;
}

function inline(text: string): React.ReactNode {
  // Handle **bold** and *italic*
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/\*(.+?)\*/);

    if (boldMatch && (italicMatch === null || boldMatch.index! <= italicMatch.index!)) {
      const idx = boldMatch.index!;
      if (idx > 0) parts.push(remaining.slice(0, idx));
      parts.push(<strong key={`b-${key++}`} className="font-bold text-ink-900">{boldMatch[1]}</strong>);
      remaining = remaining.slice(idx + boldMatch[0].length);
    } else if (italicMatch) {
      const idx = italicMatch.index!;
      if (idx > 0) parts.push(remaining.slice(0, idx));
      parts.push(<em key={`i-${key++}`} className="italic">{italicMatch[1]}</em>);
      remaining = remaining.slice(idx + italicMatch[0].length);
    } else {
      parts.push(remaining);
      remaining = '';
    }
  }

  return <>{parts}</>;
}

function renderTable(rows: string[]): string | null {
  if (rows.length < 2) return null;
  const parseRow = (r: string) =>
    r.split('|').map((c) => c.trim()).filter((_, i, arr) => i !== 0 && i !== arr.length - 1);

  // Skip separator row (|---|---|)
  const dataRows = rows.filter((r) => !r.match(/^\s*\|[\s:|-]+\|\s*$/));
  if (dataRows.length === 0) return null;

  const header = parseRow(dataRows[0]);
  const body = dataRows.slice(1).map(parseRow);

  return `
    <table class="w-full border-collapse text-sm">
      <thead>
        <tr>${header.map((h) => `<th class="border border-ink-200 bg-ink-50 px-3 py-2 text-left font-semibold text-ink-800">${escapeHtml(h)}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${body.map((row) => `<tr>${row.map((c) => `<td class="border border-ink-200 px-3 py-2 text-ink-700">${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  `;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildFullReportText(report: GeneratedReport, sub: ProjectSubmission): string {
  const chapters = [...report.chapters].sort((a, b) => a.number - b.number);
  let text = `# ${sub.projectTopic}\n\n`;
  text += `## Kakatiya University, Warangal\n\n`;
  text += `**Student Name:** ${sub.studentName}\n\n`;
  text += `**Hall Ticket Number:** ${sub.hallTicketNumber}\n\n`;
  text += `**Course:** ${sub.course}\n\n`;
  text += `**Specialization:** ${sub.specialization}\n\n`;
  text += `**Generated on:** ${formatDateTime(report.generatedAt)}\n\n`;
  text += `---\n\n`;

  for (const ch of chapters) {
    text += `# Chapter ${ch.number}: ${ch.title}\n\n`;
    text += `${ch.content}\n\n`;
    text += `---\n\n`;
  }

  return text;
}
