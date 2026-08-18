import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Course } from '@types';
import { getChapters, type ChapterDefinition } from '@lib/chapters';

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
  content: string;
}

// Use the universally supported text model
const MODEL_NAME = 'gemini-1.5 -pro'';

// Force the production-grade stable API version to prevent 404 errors
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY || '',
  { apiVersion: 'v1' }
);

function buildSystemPrompt(): string {
  return `You are an expert academic writer specializing in Indian Higher Education parameters.
WRITING STYLE REQUIREMENTS — STRICTLY ADHERE TO THE FOLLOWING:
- Write in a strict, formal, third-person academic tone throughout.
- Use Indian English spelling and conventions (e.g., organisation, programme, colour).
- Write in a scholarly, authoritative manner appropriate for a final year university project.`;
}

export async function generateChapter(
  context: GenerationContext,
  chapterNum: number,
  onProgress: (status: string) => void
): Promise<string> {
  try {
    const chapters = getChapters(context.course);
    const chapter = chapters.find(c => c.number === chapterNum);
    
    if (!chapter) {
      throw new Error(Chapter ${chapterNum} configuration not found.);
    }

    onProgress('generating');

    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME 
    });

    const prompt = `
      Project Topic: ${context.projectTopic}
      Course: ${context.course}
      Specialization: ${context.specialization}
      Student Name: ${context.studentName}
      Hall Ticket Number: ${context.hallTicketNumber}

      Generate full comprehensive content for:
      Chapter ${chapter.number}: ${chapter.title}
      Focus Guidelines: ${chapter.description}
      
      Provide exhaustive academic material with sections, sub-sections, and technical depth.
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: buildSystemPrompt(),
    });

    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Received empty response from the AI model.');
    }

    onProgress('done');
    return text;
  } catch (error) {
    onProgress('error');
    console.error(Generation error in Chapter ${chapterNum}:, error);
    throw error;
  }
}