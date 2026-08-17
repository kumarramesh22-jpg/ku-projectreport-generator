import { jsPDF } from 'jspdf';
import type { GeneratedReport, ProjectSubmission } from '@/types';
import { formatDate } from '@/lib/storage';

// ── Kakatiya University Formatting Constants ──────────────────────────────

const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm

const MARGIN_LEFT = 38.1; // 1.5 inch for binding
const MARGIN_RIGHT = 25.4; // 1 inch
const MARGIN_TOP = 25.4; // 1 inch
const MARGIN_BOTTOM = 25.4; // 1 inch

const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // ~146.5mm

const FONT_BODY = 12; // 12pt body text
const FONT_HEADING = 14; // 14pt bold uppercase headings
const FONT_SUBHEADING = 12; // 12pt bold for sub-sections
const FONT_TITLE = 18; // 18pt for cover page title
const FONT_SECTION_LABEL = 11; // 11pt for section labels

const LINE_SPACING = 1.5;
const LINE_HEIGHT_MM = (FONT_BODY * 0.352778) * LINE_SPACING; // pt→mm conversion * spacing

const SERIF_FONT = 'times';
const SERIF_STYLE = 'normal';

// ── Types ─────────────────────────────────────────────────────────────────

interface ParsedLine {
  text: string;
  type: 'h1' | 'h2' | 'h3' | 'bullet' | 'numbered' | 'paragraph' | 'blank' | 'table';
  level?: number;
  tableRows?: string[][];
  tableHeader?: string[];
}

// ── PDF Engine ────────────────────────────────────────────────────────────

export function generatePdf(report: GeneratedReport, submission: ProjectSubmission): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // Page state
  let cursorY = MARGIN_TOP;

  // ── Cover Page ──────────────────────────────────────────────────────────
  renderCoverPage(doc, submission, (y) => { cursorY = y; });

  // ── Bonafide Certificate ────────────────────────────────────────────────
  doc.addPage();
  cursorY = MARGIN_TOP;
  renderBonafideCertificate(doc, submission, (y) => { cursorY = y; });

  // ── Declaration ─────────────────────────────────────────────────────────
  doc.addPage();
  cursorY = MARGIN_TOP;
  renderDeclaration(doc, submission, (y) => { cursorY = y; });

  // ── Chapters ────────────────────────────────────────────────────────────
  const chapters = [...report.chapters].sort((a, b) => a.number - b.number);
  for (const chapter of chapters) {
    doc.addPage();
    cursorY = MARGIN_TOP;
    renderChapter(doc, chapter, submission, cursorY, (y) => { cursorY = y; });
  }

  return doc;
}

export function downloadPdf(report: GeneratedReport, submission: ProjectSubmission): void {
  const doc = generatePdf(report, submission);
  const fileName = `${submission.hallTicketNumber}_${submission.studentName.replace(/\s+/g, '_')}_Report.pdf`;
  doc.save(fileName);
}

// ── Cursor / Page Management ───────────────────────────────────────────────

function ensureSpace(
  doc: jsPDF,
  currentY: number,
  neededMm: number,
  onNewPage: () => void
): number {
  if (currentY + neededMm > PAGE_HEIGHT - MARGIN_BOTTOM) {
    doc.addPage();
    onNewPage();
    return MARGIN_TOP;
  }
  return currentY;
}

// ── Text Wrapping ──────────────────────────────────────────────────────────

function splitText(doc: jsPDF, text: string, fontSize: number, maxWidthMm: number): string[] {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidthMm);
  return lines as string[];
}

// ── Cover Page ────────────────────────────────────────────────────────────

function renderCoverPage(
  doc: jsPDF,
  sub: ProjectSubmission,
  setY: (y: number) => void
): void {
  let y = MARGIN_TOP + 10;

  // University name
  doc.setFont(SERIF_FONT, 'bold');
  doc.setFontSize(16);
  const uniLines = splitText(doc, 'KAKATIYA UNIVERSITY', 16, CONTENT_WIDTH);
  for (const line of uniLines) {
    doc.text(line, PAGE_WIDTH / 2, y, { align: 'center' });
    y += 7;
  }

  doc.setFontSize(12);
  doc.setFont(SERIF_FONT, 'normal');
  doc.text('Warangal, Telangana — 506009', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 8;

  doc.setFont(SERIF_FONT, 'italic');
  doc.text('(Re-accredited by NAAC with A Grade)', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 14;

  // Horizontal rule
  doc.setLineWidth(0.5);
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);
  y += 14;

  // Department / course label
  doc.setFont(SERIF_FONT, 'bold');
  doc.setFontSize(13);
  doc.text(
    `${sub.course === 'MBA' ? 'MASTER OF BUSINESS ADMINISTRATION' : 'BACHELOR OF TECHNOLOGY'}`,
    PAGE_WIDTH / 2,
    y,
    { align: 'center' }
  );
  y += 7;
  doc.setFont(SERIF_FONT, 'normal');
  doc.setFontSize(11);
  doc.text(`Department of ${sub.specialization}`, PAGE_WIDTH / 2, y, { align: 'center' });
  y += 20;

  // Project title
  doc.setFont(SERIF_FONT, 'bold');
  doc.setFontSize(FONT_TITLE);
  const titleLines = splitText(doc, sub.projectTopic.toUpperCase(), FONT_TITLE, CONTENT_WIDTH - 10);
  for (const line of titleLines) {
    doc.text(line, PAGE_WIDTH / 2, y, { align: 'center' });
    y += 9;
  }
  y += 10;

  // Subtitle
  doc.setFont(SERIF_FONT, 'normal');
  doc.setFontSize(12);
  doc.text(
    `A ${sub.course} Project Report Submitted in Partial Fulfillment`,
    PAGE_WIDTH / 2,
    y,
    { align: 'center' }
  );
  y += 6;
  doc.text('of the Requirements for the Award of the Degree', PAGE_WIDTH / 2, y, {
    align: 'center',
  });
  y += 20;

  // Student details box
  const boxX = MARGIN_LEFT + 15;
  const boxWidth = CONTENT_WIDTH - 30;
  const boxY = y;
  const boxHeight = 42;

  doc.setDrawColor(0.4);
  doc.setLineWidth(0.3);
  doc.rect(boxX, boxY, boxWidth, boxHeight);

  doc.setFontSize(12);
  doc.setFont(SERIF_FONT, 'bold');
  doc.text('Submitted by:', boxX + 5, boxY + 7);
  doc.setFont(SERIF_FONT, 'normal');
  doc.text(sub.studentName, boxX + boxWidth - 5, boxY + 7, { align: 'right' });

  doc.setFont(SERIF_FONT, 'bold');
  doc.text('Hall Ticket No.:', boxX + 5, boxY + 14);
  doc.setFont(SERIF_FONT, 'normal');
  doc.text(sub.hallTicketNumber, boxX + boxWidth - 5, boxY + 14, { align: 'right' });

  doc.setFont(SERIF_FONT, 'bold');
  doc.text('Specialization:', boxX + 5, boxY + 21);
  doc.setFont(SERIF_FONT, 'normal');
  const specLines = splitText(doc, sub.specialization, 11, boxWidth - 50);
  let specY = boxY + 21;
  for (const sl of specLines) {
    doc.text(sl, boxX + boxWidth - 5, specY, { align: 'right' });
    specY += 5;
  }

  doc.setFont(SERIF_FONT, 'bold');
  doc.text('Academic Year:', boxX + 5, boxY + 35);
  doc.setFont(SERIF_FONT, 'normal');
  doc.text('2025 – 2026', boxX + boxWidth - 5, boxY + 35, { align: 'right' });

  y = boxY + boxHeight + 18;

  // Guide / Supervisor placeholder
  doc.setFontSize(11);
  doc.setFont(SERIF_FONT, 'italic');
  doc.text('Under the Guidance of', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 14;

  doc.setFont(SERIF_FONT, 'bold');
  doc.text('___________________________', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 6;
  doc.setFont(SERIF_FONT, 'normal');
  doc.text('(Project Guide)', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 14;

  doc.setLineWidth(0.5);
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont(SERIF_FONT, 'italic');
  doc.text(
    'This is to certify that the project report is a record of work carried out by the candidate.',
    PAGE_WIDTH / 2,
    y,
    { align: 'center' }
  );

  setY(y);
}

// ── Bonafide Certificate ──────────────────────────────────────────────────

function renderBonafideCertificate(
  doc: jsPDF,
  sub: ProjectSubmission,
  setY: (y: number) => void
): void {
  let y = MARGIN_TOP + 5;

  doc.setFont(SERIF_FONT, 'bold');
  doc.setFontSize(FONT_HEADING);
  doc.text('BONAFIDE CERTIFICATE', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 12;

  doc.setLineWidth(0.4);
  doc.line(MARGIN_LEFT + 30, y, PAGE_WIDTH - MARGIN_RIGHT - 30, y);
  y += 14;

  doc.setFont(SERIF_FONT, 'normal');
  doc.setFontSize(FONT_BODY);

  const certBody = [
    `This is to certify that the project report entitled "${sub.projectTopic}" is a bonafide work of ${sub.studentName} (Hall Ticket No. ${sub.hallTicketNumber}) carried out in partial fulfillment of the requirements for the award of the degree of ${sub.course} with specialization in ${sub.specialization} during the academic year 2025 – 2026.`,
    '',
    `The project work has been carried out under the guidance and supervision of the undersigned. The candidate has fulfilled all the requirements as prescribed by the regulations of Kakatiya University, Warangal, and the work is hereby approved for submission.`,
    '',
    'The candidate has shown satisfactory progress and has completed the project work with diligence and academic integrity. To the best of our knowledge, the work is original and has not been submitted elsewhere for the award of any degree or diploma.',
  ];

  for (const para of certBody) {
    if (para === '') {
      y += LINE_HEIGHT_MM;
      continue;
    }
    const lines = splitText(doc, para, FONT_BODY, CONTENT_WIDTH);
    for (const line of lines) {
      y = ensureSpace(doc, y, LINE_HEIGHT_MM, () => {});
      doc.text(line, MARGIN_LEFT, y);
      y += LINE_HEIGHT_MM;
    }
  }

  y += 16;

  // Signature blocks
  const colLeft = MARGIN_LEFT + 10;
  const colRight = PAGE_WIDTH - MARGIN_RIGHT - 10;

  doc.setFontSize(FONT_BODY);
  doc.setFont(SERIF_FONT, 'bold');

  doc.text('Project Guide', colLeft, y);
  doc.text('Head of Department', colRight, y, { align: 'right' });
  y += 14;

  doc.setFont(SERIF_FONT, 'normal');
  doc.text('___________________________', colLeft, y);
  doc.text('___________________________', colRight, y, { align: 'right' });
  y += 6;

  doc.setFont(SERIF_FONT, 'italic');
  doc.setFontSize(FONT_SECTION_LABEL);
  doc.text('Department of ' + sub.specialization, colLeft, y);
  doc.text('Department of ' + sub.specialization, colRight, y, { align: 'right' });
  y += 20;

  doc.setFontSize(FONT_BODY);
  doc.setFont(SERIF_FONT, 'bold');
  doc.text('Submitted for examination on:', MARGIN_LEFT, y);
  y += 6;
  doc.setFont(SERIF_FONT, 'normal');
  doc.text('Date: ____________     Place: Warangal', MARGIN_LEFT, y);

  y += 16;
  doc.setFont(SERIF_FONT, 'bold');
  doc.text('External Examiner', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 12;
  doc.setFont(SERIF_FONT, 'normal');
  doc.text('___________________________', PAGE_WIDTH / 2, y, { align: 'center' });

  setY(y);
}

// ── Declaration ───────────────────────────────────────────────────────────

function renderDeclaration(
  doc: jsPDF,
  sub: ProjectSubmission,
  setY: (y: number) => void
): void {
  let y = MARGIN_TOP + 5;

  doc.setFont(SERIF_FONT, 'bold');
  doc.setFontSize(FONT_HEADING);
  doc.text('DECLARATION', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 12;

  doc.setLineWidth(0.4);
  doc.line(MARGIN_LEFT + 30, y, PAGE_WIDTH - MARGIN_RIGHT - 30, y);
  y += 14;

  doc.setFont(SERIF_FONT, 'normal');
  doc.setFontSize(FONT_BODY);

  const declBody = [
    `I, ${sub.studentName}, bearing Hall Ticket Number ${sub.hallTicketNumber}, hereby declare that the project report entitled "${sub.projectTopic}" submitted to Kakatiya University, Warangal, in partial fulfillment of the requirements for the award of the degree of ${sub.course} with specialization in ${sub.specialization}, is a record of original and independent research work carried out by me under the guidance and supervision of the undersigned.`,
    '',
    'I further declare that the information furnished in this report is true to the best of my knowledge and belief. This project work has not been submitted, either in part or in full, to any other university or institution for the award of any degree, diploma, or fellowship. All sources of information and help received from various individuals and institutions have been duly acknowledged and cited at appropriate places in the report.',
    '',
    'I bear the responsibility for any errors, omissions, or discrepancies found in this report.',
  ];

  for (const para of declBody) {
    if (para === '') {
      y += LINE_HEIGHT_MM;
      continue;
    }
    const lines = splitText(doc, para, FONT_BODY, CONTENT_WIDTH);
    for (const line of lines) {
      y = ensureSpace(doc, y, LINE_HEIGHT_MM, () => {});
      doc.text(line, MARGIN_LEFT, y);
      y += LINE_HEIGHT_MM;
    }
  }

  y += 14;

  doc.setFontSize(FONT_BODY);
  doc.setFont(SERIF_FONT, 'normal');
  doc.text('Place: Warangal', MARGIN_LEFT, y);
  y += 6;
  doc.text('Date: ____________', MARGIN_LEFT, y);
  y += 20;

  doc.setFont(SERIF_FONT, 'bold');
  doc.text('Signature of the Candidate', MARGIN_LEFT, y);
  y += 14;
  doc.setFont(SERIF_FONT, 'normal');
  doc.text('___________________________', MARGIN_LEFT, y);
  y += 6;
  doc.text(`Name: ${sub.studentName}`, MARGIN_LEFT, y);
  y += 6;
  doc.text(`Hall Ticket No.: ${sub.hallTicketNumber}`, MARGIN_LEFT, y);

  setY(y);
}

// ── Chapter Rendering ─────────────────────────────────────────────────────

function renderChapter(
  doc: jsPDF,
  chapter: { number: number; title: string; subtitle: string; content: string },
  sub: ProjectSubmission,
  startY: number,
  setY: (y: number) => void
): void {
  let y = startY;

  // Chapter heading — 14pt bold uppercase, centered
  doc.setFont(SERIF_FONT, 'bold');
  doc.setFontSize(FONT_HEADING);
  const headingText = `CHAPTER ${chapter.number}: ${chapter.title.toUpperCase()}`;
  const headingLines = splitText(doc, headingText, FONT_HEADING, CONTENT_WIDTH);
  for (const line of headingLines) {
    y = ensureSpace(doc, y, LINE_HEIGHT_MM + 2, () => {});
    doc.text(line, PAGE_WIDTH / 2, y, { align: 'center' });
    y += LINE_HEIGHT_MM + 1;
  }

  // Underline
  doc.setLineWidth(0.4);
  doc.line(MARGIN_LEFT + 20, y, PAGE_WIDTH - MARGIN_RIGHT - 20, y);
  y += 8;

  // Parse and render markdown content
  const parsed = parseMarkdown(chapter.content);
  for (const block of parsed) {
    y = renderBlock(doc, block, y, () => {});
  }

  setY(y);
}

// ── Markdown Parser ───────────────────────────────────────────────────────

function parseMarkdown(content: string): ParsedLine[] {
  const rawLines = content.split('\n');
  const parsed: ParsedLine[] = [];
  let tableBuffer: string[] = [];
  let inTable = false;

  function flushTable() {
    if (tableBuffer.length < 2) {
      tableBuffer = [];
      inTable = false;
      return;
    }
    const parseRow = (r: string) =>
      r
        .split('|')
        .map((c) => c.trim())
        .filter((_, i, arr) => i !== 0 && i !== arr.length - 1);

    const dataRows = tableBuffer.filter((r) => !r.match(/^\s*\|[\s:|-]+\|\s*$/));
    if (dataRows.length === 0) {
      tableBuffer = [];
      inTable = false;
      return;
    }

    const header = parseRow(dataRows[0]);
    const body = dataRows.slice(1).map(parseRow);

    parsed.push({
      text: '',
      type: 'table',
      tableHeader: header,
      tableRows: body,
    });
    tableBuffer = [];
    inTable = false;
  }

  for (const line of rawLines) {
    const trimmed = line.trim();

    // Table detection
    if (trimmed.startsWith('|') && trimmed.includes('|', 1)) {
      inTable = true;
      tableBuffer.push(trimmed);
      continue;
    }
    if (inTable) {
      flushTable();
    }

    if (trimmed === '') {
      parsed.push({ text: '', type: 'blank' });
      continue;
    }

    if (trimmed.startsWith('### ')) {
      parsed.push({ text: stripInline(trimmed.slice(4)), type: 'h3', level: 3 });
    } else if (trimmed.startsWith('## ')) {
      parsed.push({ text: stripInline(trimmed.slice(3)), type: 'h2', level: 2 });
    } else if (trimmed.startsWith('# ')) {
      parsed.push({ text: stripInline(trimmed.slice(2)), type: 'h1', level: 1 });
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      parsed.push({ text: stripInline(trimmed.slice(2)), type: 'bullet' });
    } else {
      const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numberedMatch) {
        parsed.push({ text: stripInline(numberedMatch[2]), type: 'numbered' });
      } else {
        parsed.push({ text: stripInline(trimmed), type: 'paragraph' });
      }
    }
  }
  if (inTable) flushTable();

  return parsed;
}

function stripInline(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
}

// ── Block Renderer ────────────────────────────────────────────────────────

function renderBlock(
  doc: jsPDF,
  block: ParsedLine,
  y: number,
  onPageBreak: () => void
): number {
  switch (block.type) {
    case 'blank':
      return y + LINE_HEIGHT_MM * 0.6;

    case 'h1': {
      doc.setFont(SERIF_FONT, 'bold');
      doc.setFontSize(FONT_HEADING);
      const lines = splitText(doc, block.text.toUpperCase(), FONT_HEADING, CONTENT_WIDTH);
      for (const line of lines) {
        y = ensureSpace(doc, y, LINE_HEIGHT_MM + 1, onPageBreak);
        doc.text(line, MARGIN_LEFT, y);
        y += LINE_HEIGHT_MM + 1;
      }
      return y + 2;
    }

    case 'h2': {
      doc.setFont(SERIF_FONT, 'bold');
      doc.setFontSize(FONT_SUBHEADING);
      const lines = splitText(doc, block.text, FONT_SUBHEADING, CONTENT_WIDTH);
      for (const line of lines) {
        y = ensureSpace(doc, y, LINE_HEIGHT_MM, onPageBreak);
        doc.text(line, MARGIN_LEFT, y);
        y += LINE_HEIGHT_MM;
      }
      return y + 1;
    }

    case 'h3': {
      doc.setFont(SERIF_FONT, 'bolditalic');
      doc.setFontSize(FONT_BODY);
      const lines = splitText(doc, block.text, FONT_BODY, CONTENT_WIDTH);
      for (const line of lines) {
        y = ensureSpace(doc, y, LINE_HEIGHT_MM, onPageBreak);
        doc.text(line, MARGIN_LEFT, y);
        y += LINE_HEIGHT_MM;
      }
      return y + 0.5;
    }

    case 'bullet': {
      doc.setFont(SERIF_FONT, 'normal');
      doc.setFontSize(FONT_BODY);
      const indent = 8;
      const wrapWidth = CONTENT_WIDTH - indent;
      const lines = splitText(doc, '\u2022  ' + block.text, FONT_BODY, wrapWidth);
      for (let i = 0; i < lines.length; i++) {
        y = ensureSpace(doc, y, LINE_HEIGHT_MM, onPageBreak);
        const prefix = i === 0 ? '' : '   ';
        doc.text(prefix + lines[i], MARGIN_LEFT + indent, y);
        y += LINE_HEIGHT_MM;
      }
      return y;
    }

    case 'numbered': {
      doc.setFont(SERIF_FONT, 'normal');
      doc.setFontSize(FONT_BODY);
      const indent = 8;
      const wrapWidth = CONTENT_WIDTH - indent;
      const lines = splitText(doc, block.text, FONT_BODY, wrapWidth);
      for (let i = 0; i < lines.length; i++) {
        y = ensureSpace(doc, y, LINE_HEIGHT_MM, onPageBreak);
        doc.text(lines[i], MARGIN_LEFT + indent, y);
        y += LINE_HEIGHT_MM;
      }
      return y;
    }

    case 'table': {
      return renderTableBlock(doc, block, y, onPageBreak);
    }

    case 'paragraph':
    default: {
      doc.setFont(SERIF_FONT, SERIF_STYLE);
      doc.setFontSize(FONT_BODY);
      const lines = splitText(doc, block.text, FONT_BODY, CONTENT_WIDTH);
      for (const line of lines) {
        y = ensureSpace(doc, y, LINE_HEIGHT_MM, onPageBreak);
        doc.text(line, MARGIN_LEFT, y);
        y += LINE_HEIGHT_MM;
      }
      return y;
    }
  }
}

// ── Table Renderer ────────────────────────────────────────────────────────

function renderTableBlock(
  doc: jsPDF,
  block: ParsedLine,
  y: number,
  onPageBreak: () => void
): number {
  if (!block.tableHeader || !block.tableRows) return y;

  const headers = block.tableHeader;
  const rows = block.tableRows;
  const numCols = headers.length;
  if (numCols === 0) return y;

  const colWidth = CONTENT_WIDTH / numCols;
  const cellPadding = 2;
  const cellLineHeight = 4.5;

  function renderRow(
    cells: string[],
    isHeader: boolean,
    currentY: number
  ): number {
    // Calculate row height based on tallest cell
    let rowHeight = cellLineHeight;
    const cellLines: string[][] = [];
    for (let c = 0; c < numCols; c++) {
      const text = cells[c] ?? '';
      const lines = splitText(doc, text, FONT_BODY - 1, colWidth - cellPadding * 2);
      cellLines.push(lines);
      const h = lines.length * cellLineHeight + cellPadding;
      if (h > rowHeight) rowHeight = h;
    }

    currentY = ensureSpace(doc, currentY, rowHeight, onPageBreak);

    // Draw cell borders and text
    for (let c = 0; c < numCols; c++) {
      const x = MARGIN_LEFT + c * colWidth;

      // Border
      doc.setDrawColor(0.5);
      doc.setLineWidth(0.2);
      doc.rect(x, currentY, colWidth, rowHeight);

      // Text
      if (isHeader) {
        doc.setFont(SERIF_FONT, 'bold');
      } else {
        doc.setFont(SERIF_FONT, 'normal');
      }
      doc.setFontSize(FONT_BODY - 1);

      const lines = cellLines[c];
      let textY = currentY + cellPadding + 3;
      for (const line of lines) {
        doc.text(line, x + cellPadding, textY);
        textY += cellLineHeight;
      }
    }

    return currentY + rowHeight;
  }

  let tableY = y + 2;
  tableY = renderRow(headers, true, tableY);
  for (const row of rows) {
    tableY = renderRow(row, false, tableY);
  }

  return tableY + 4;
}
