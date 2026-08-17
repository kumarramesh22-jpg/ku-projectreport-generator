import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Course } from '@/types';
import { getChapters, type ChapterDefinition } from '@/lib/chapters';

export interface GenerationContext {
  studentName: string;
  hallTicketNumber: string;
  course: Course;
  specialization: string;
  projectTopic: string;
}

export interface ChapterResult {
  number: number;
  title: string;
  subtitle: string;
  content: string;
}

export type ProgressCallback = (
  chapterNumber: number,
  totalChapters: number,
  chapterTitle: string,
  status: 'generating' | 'done' | 'error'
) => void;

const MODEL_NAME = 'gemini-1.5-flash';

function buildSystemPrompt(): string {
  return `You are an expert academic writer specializing in Indian university project reports, specifically for Kakatiya University, Warangal, Telangana.

WRITING STYLE REQUIREMENTS — STRICTLY ADHERE:
- Write in a strict, formal, third-person academic tone throughout. Never use first person ("I", "we", "our", "my") or second person ("you", "your").
- Use Indian English spelling and conventions (e.g., "organisation", "programme", "behaviour").
- Write in a scholarly, authoritative manner appropriate for a postgraduate or undergraduate major project report submitted to an Indian university.
- Use proper academic structure with numbered headings and subheadings (e.g., "1.1 Introduction", "1.2 Objectives").
- Each section must be substantial — write detailed, well-developed paragraphs of at least 150-200 words per subsection. The chapter as a whole should be comprehensive and thorough.
- Use formal transitions between sections.
- Include plausible, realistic data, examples, and citations where appropriate. For literature reviews, generate realistic author names, publication years, journal names, and findings — these should be plausible but clearly illustrative.
- Reference Indian industry context, Indian market data, and Indian regulatory frameworks where relevant.
- Do not use conversational language, contractions, colloquialisms, or informal expressions.
- Do not include any meta-commentary, disclaimers about being an AI, or notes about the content being generated.
- Output should be in clean Markdown format with proper heading hierarchy (# for chapter title, ## for sections, ### for subsections).
- Do not include the chapter title at the top — start directly with the first section heading.`;
}

function buildChapterPrompt(
  chapter: ChapterDefinition,
  context: GenerationContext,
  previousSummaries: string[]
): string {
  const contextBlock = `PROJECT REPORT DETAILS:
- Student Name: ${context.studentName}
- Hall Ticket Number: ${context.hallTicketNumber}
- Course: ${context.course}
- Specialization: ${context.specialization}
- Project Topic: ${context.projectTopic}`;

  const continuityBlock =
    previousSummaries.length > 0
      ? `\n\nPREVIOUS CHAPTERS WRITTEN (for continuity and consistency — do not repeat their content, but maintain logical flow and cross-references):\n${previousSummaries.join('\n')}`
      : '';

  return `${contextBlock}

${chapter.prompt}

Write this chapter now. Ensure it is detailed, well-structured, and maintains academic rigor appropriate for a ${context.course} project at Kakatiya University.${continuityBlock}`;
}

function extractSummary(content: string, maxWords: number = 80): string {
  const plain = content.replace(/[#*`]/g, '').trim();
  const words = plain.split(/\s+/).slice(0, maxWords).join(' ');
  return words + (plain.split(/\s+/).length > maxWords ? '...' : '');
}

export async function generateReport(
  apiKey: string,
  context: GenerationContext,
  onProgress?: ProgressCallback
): Promise<{ chapters: ChapterResult[]; error?: string }> {
  if (!apiKey.trim()) {
    return { chapters: [], error: 'No API key provided. Please add your Google Gemini API key in Settings.' };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: buildSystemPrompt(),
    });

    const chapters = getChapters(context.course);
    const results: ChapterResult[] = [];
    const summaries: string[] = [];

    for (const chapter of chapters) {
      onProgress?.(chapter.number, chapters.length, chapter.title, 'generating');

      try {
        const prompt = buildChapterPrompt(chapter, context, summaries);
        const result = await model.generateContent(prompt);
        const content = result.response.text();

        results.push({
          number: chapter.number,
          title: chapter.title,
          subtitle: chapter.subtitle,
          content,
        });

        summaries.push(
          `Chapter ${chapter.number} (${chapter.title}): ${extractSummary(content)}`
        );

        onProgress?.(chapter.number, chapters.length, chapter.title, 'done');
      } catch (err) {
        onProgress?.(chapter.number, chapters.length, chapter.title, 'error');
        const message = err instanceof Error ? err.message : 'Unknown error';
        return {
          chapters: results,
          error: `Chapter ${chapter.number} (${chapter.title}) failed: ${message}`,
        };
      }
    }

    return { chapters: results };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to initialize Gemini client';
    return { chapters: [], error: message };
  }
}

export async function regenerateChapter(
  apiKey: string,
  context: GenerationContext,
  chapterNumber: number,
  previousSummaries: string[]
): Promise<{ content?: string; error?: string }> {
  if (!apiKey.trim()) {
    return { error: 'No API key provided.' };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: buildSystemPrompt(),
    });

    const chapters = getChapters(context.course);
    const chapter = chapters.find((c) => c.number === chapterNumber);
    if (!chapter) {
      return { error: `Chapter ${chapterNumber} not found for ${context.course}.` };
    }

    const prompt = buildChapterPrompt(chapter, context, previousSummaries);
    const result = await model.generateContent(prompt);
    return { content: result.response.text() };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { error: message };
  }
}
