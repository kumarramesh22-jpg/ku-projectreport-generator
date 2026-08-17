import { useState, useCallback, useRef } from 'react';
import { generateReport, type GenerationContext, type ChapterResult, type ProgressCallback } from '@/lib/gemini';
import { saveReport } from '@/lib/storage';
import type { GeneratedReport } from '@/types';

export type ChapterStatus = 'pending' | 'generating' | 'done' | 'error';

export interface ChapterProgress {
  number: number;
  title: string;
  status: ChapterStatus;
}

export function useReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<ChapterProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [completedReport, setCompletedReport] = useState<GeneratedReport | null>(null);
  const abortRef = useRef(false);

  const generate = useCallback(
    async (apiKey: string, context: GenerationContext, totalChapters: number) => {
      setIsGenerating(true);
      setError(null);
      setCompletedReport(null);
      abortRef.current = false;

      const initial: ChapterProgress[] = Array.from({ length: totalChapters }, (_, i) => ({
        number: i + 1,
        title: '',
        status: 'pending' as ChapterStatus,
      }));
      setProgress(initial);

      const onProgress: ProgressCallback = (chapterNumber, _total, chapterTitle, status) => {
        setProgress((prev) =>
          prev.map((p) =>
            p.number === chapterNumber
              ? { ...p, title: chapterTitle || p.title, status: status === 'done' ? 'done' : status === 'error' ? 'error' : 'generating' }
              : p
          )
        );
      };

      const result = await generateReport(apiKey, context, onProgress);

      if (abortRef.current) {
        setIsGenerating(false);
        return;
      }

      if (result.error) {
        setError(result.error);
      }

      if (result.chapters.length > 0) {
        const report: GeneratedReport = {
          submissionId: context.hallTicketNumber,
          chapters: result.chapters as ChapterResult[] as GeneratedReport['chapters'],
          generatedAt: Date.now(),
        };
        saveReport(report);
        setCompletedReport(report);
      }

      setIsGenerating(false);
    },
    []
  );

  const abort = useCallback(() => {
    abortRef.current = true;
    setIsGenerating(false);
  }, []);

  const reset = useCallback(() => {
    setProgress([]);
    setError(null);
    setCompletedReport(null);
  }, []);

  return { isGenerating, progress, error, completedReport, generate, abort, reset };
}
