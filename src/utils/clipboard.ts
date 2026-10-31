import { ExamData, Question } from '../types/exam';
import {
  formatChoiceLabel,
  formatQuestionNumber,
  resolveLayout,
  toKurdishDigits,
} from './kurdishUtils';

/**
 * Builds clean RTL HTML formatted for Microsoft Word and Google Docs.
 * Uses borderless tables for choice columns so Word locks them in place.
 */
export const generateWordHtml = (data: ExamData): string => {
  const { header, settings, questions } = data;

  const fontStack = "'Vazirmatn', 'Tahoma', 'Segoe UI', 'Arial', sans-serif";
  const baseFontSize =
    settings.fontSize === 'sm' ? '11pt' : settings.fontSize === 'lg' ? '14pt' : '12pt';
  const qFontSize =
    settings.fontSize === 'sm' ? '12pt' : settings.fontSize === 'lg' ? '15pt' : '13pt';

  let html = `<!DOCTYPE html>
<html dir="rtl" lang="ckb">
<head>
<meta charset="utf-8">
<title>تاقیکردنەوە</title>
<style>
  body {
    font-family: ${fontStack};
    direction: rtl;
    text-align: right;
    font-size: ${baseFontSize};
    color: #111827;
    line-height: 1.6;
  }
  table.exam-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8pt;
  }
  table.exam-table td {
    padding: 2pt 6pt;
    vertical-align: top;
    text-align: right;
  }
  .q-title {
    font-size: ${qFontSize};
    font-weight: bold;
    margin: 8pt 0 4pt 0;
  }
  .header-box {
    border-bottom: 2pt solid #1e293b;
    padding-bottom: 8pt;
    margin-bottom: 14pt;
  }
</style>
</head>
<body dir="rtl">
`;

  // Exam Header
  if (header.enabled) {
    html += `<div class="header-box" dir="rtl">
  <table style="width: 100%; border-collapse: collapse; font-family: ${fontStack}; font-size: 11pt;">
    <tr>
      <td style="width: 33%; text-align: right; vertical-align: top;">
        ${header.directorate ? `<div>${header.directorate}</div>` : ''}
        ${header.schoolName ? `<strong>${header.schoolName}</strong>` : ''}
      </td>
      <td style="width: 34%; text-align: center; vertical-align: top;">
        ${header.examType ? `<div style="font-weight: bold; font-size: 12pt;">${header.examType}</div>` : ''}
        ${header.academicYear ? `<div>ساڵی خوێندن: ${header.academicYear}</div>` : ''}
      </td>
      <td style="width: 33%; text-align: left; vertical-align: top; direction: rtl;">
        ${header.subject ? `<div><strong>بابەت:</strong> ${header.subject}</div>` : ''}
        ${header.grade ? `<div><strong>پۆل:</strong> ${header.grade}</div>` : ''}
        ${header.timeAllowed ? `<div><strong>کات:</strong> ${header.timeAllowed}</div>` : ''}
      </td>
    </tr>
  </table>
  <table style="width: 100%; border-collapse: collapse; margin-top: 6pt; font-size: 10.5pt;">
    <tr>
      <td style="width: 50%; text-align: right;">${header.teacherName ? `<strong>مامۆستای بابەت:</strong> ${header.teacherName}` : ''}</td>
      <td style="width: 50%; text-align: left; direction: rtl;">${header.totalMarks ? `<strong>نمرەی گشتی:</strong> ${header.totalMarks}` : ''}</td>
    </tr>
  </table>
  ${header.instructions ? `<div style="margin-top: 8pt; font-weight: 500; font-size: 11pt; border-top: 1px dashed #94a3b8; padding-top: 4pt;">${header.instructions}</div>` : ''}
</div>`;
  }

  // Questions
  questions.forEach((q, qIndex) => {
    const qNum = formatQuestionNumber(qIndex + 1, settings.numberingStyle);
    const resolved = resolveLayout(q.layout, q.choices);

    let pointsText = '';
    if (settings.showPoints && q.points) {
      pointsText = ` <span style="font-size: 10pt; font-weight: normal; color: #475569;">(${toKurdishDigits(q.points)} نمرە)</span>`;
    }

    html += `\n<div style="margin-bottom: 12pt; page-break-inside: avoid;">
  <p class="q-title" dir="rtl" style="font-family: ${fontStack}; margin: 6pt 0 4pt 0;">
    <span>${qNum}</span> ${escapeHtml(q.text)}${pointsText}
  </p>`;

    html += renderChoicesHtml(q, resolved, settings);
    html += `\n</div>`;
  });

  html += `\n</body>\n</html>`;
  return html;
};

const renderChoicesHtml = (
  q: Question,
  layout: '1-row' | '2-row' | 'vertical',
  settings: ExamData['settings']
): string => {
  const fontStack = "'Vazirmatn', 'Tahoma', 'Segoe UI', 'Arial', sans-serif";
  const numChoices = q.choices.length;

  if (layout === '1-row') {
    const colWidth = Math.floor(100 / Math.max(numChoices, 1));
    const cells = q.choices
      .map((choice, i) => {
        const label = formatChoiceLabel(i, settings.choiceMarker, settings.bracketStyle);
        const isCorrect = settings.showAnswerKey && q.correctIndex === i;
        const style = isCorrect ? 'color: #15803d; font-weight: bold;' : '';
        return `<td style="width: ${colWidth}%; text-align: right; padding: 2pt 4pt; vertical-align: top; ${style}">
          <span style="font-weight: 600;">${label}</span> ${escapeHtml(choice)}
        </td>`;
      })
      .join('');
    return `\n  <table class="exam-table" dir="rtl" border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: ${fontStack};">
    <tr>${cells}</tr>
  </table>`;
  }

  if (layout === '2-row') {
    let rowsHtml = '';
    for (let r = 0; r < numChoices; r += 2) {
      const c1 = q.choices[r];
      const c2 = q.choices[r + 1];

      const label1 = formatChoiceLabel(r, settings.choiceMarker, settings.bracketStyle);
      const isCorrect1 = settings.showAnswerKey && q.correctIndex === r;
      const style1 = isCorrect1 ? 'color: #15803d; font-weight: bold;' : '';

      let cell2Html = '';
      if (c2 !== undefined) {
        const label2 = formatChoiceLabel(r + 1, settings.choiceMarker, settings.bracketStyle);
        const isCorrect2 = settings.showAnswerKey && q.correctIndex === r + 1;
        const style2 = isCorrect2 ? 'color: #15803d; font-weight: bold;' : '';
        cell2Html = `<td style="width: 50%; text-align: right; padding: 2pt 4pt; vertical-align: top; ${style2}">
          <span style="font-weight: 600;">${label2}</span> ${escapeHtml(c2)}
        </td>`;
      } else {
        cell2Html = `<td style="width: 50%;"></td>`;
      }

      rowsHtml += `<tr>
        <td style="width: 50%; text-align: right; padding: 2pt 4pt; vertical-align: top; ${style1}">
          <span style="font-weight: 600;">${label1}</span> ${escapeHtml(c1)}
        </td>
        ${cell2Html}
      </tr>`;
    }
    return `\n  <table class="exam-table" dir="rtl" border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: ${fontStack};">
    ${rowsHtml}
  </table>`;
  }

  // Vertical layout
  const rows = q.choices
    .map((choice, i) => {
      const label = formatChoiceLabel(i, settings.choiceMarker, settings.bracketStyle);
      const isCorrect = settings.showAnswerKey && q.correctIndex === i;
      const style = isCorrect ? 'color: #15803d; font-weight: bold;' : '';
      return `<tr>
        <td style="width: 100%; text-align: right; padding: 2pt 4pt; vertical-align: top; ${style}">
          <span style="font-weight: 600;">${label}</span> ${escapeHtml(choice)}
        </td>
      </tr>`;
    })
    .join('');

  return `\n  <table class="exam-table" dir="rtl" border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: ${fontStack};">
    ${rows}
  </table>`;
};

/**
 * Builds clean plain-text fallback with tab stops and clean spacing.
 */
export const generatePlainText = (data: ExamData): string => {
  const { header, settings, questions } = data;
  const lines: string[] = [];

  if (header.enabled) {
    if (header.schoolName) lines.push(header.schoolName);
    if (header.directorate) lines.push(header.directorate);
    const meta: string[] = [];
    if (header.subject) meta.push(`بابەت: ${header.subject}`);
    if (header.grade) meta.push(`پۆل: ${header.grade}`);
    if (header.timeAllowed) meta.push(`کات: ${header.timeAllowed}`);
    if (meta.length > 0) lines.push(meta.join('   |   '));
    if (header.examType) lines.push(`تاقیکردنەوە: ${header.examType}`);
    if (header.instructions) lines.push(`\n${header.instructions}`);
    lines.push('-----------------------------------------------------\n');
  }

  questions.forEach((q, idx) => {
    const qNum = formatQuestionNumber(idx + 1, settings.numberingStyle);
    const points = settings.showPoints && q.points ? ` (${toKurdishDigits(q.points)} نمرە)` : '';
    lines.push(`${qNum} ${q.text}${points}`);

    const resolved = resolveLayout(q.layout, q.choices);

    if (resolved === '1-row') {
      const choiceStr = q.choices
        .map((c, i) => `${formatChoiceLabel(i, settings.choiceMarker, settings.bracketStyle)} ${c}`)
        .join('\t\t');
      lines.push(choiceStr);
    } else if (resolved === '2-row') {
      for (let r = 0; r < q.choices.length; r += 2) {
        const c1 = `${formatChoiceLabel(r, settings.choiceMarker, settings.bracketStyle)} ${q.choices[r]}`;
        const c2 = q.choices[r + 1]
          ? `\t\t${formatChoiceLabel(r + 1, settings.choiceMarker, settings.bracketStyle)} ${q.choices[r + 1]}`
          : '';
        lines.push(`${c1}${c2}`);
      }
    } else {
      q.choices.forEach((c, i) => {
        lines.push(`${formatChoiceLabel(i, settings.choiceMarker, settings.bracketStyle)} ${c}`);
      });
    }

    lines.push(''); // blank line between questions
  });

  return lines.join('\n');
};

/**
 * Copies dual-format HTML and Plain text directly to the clipboard.
 */
export const copyExamToClipboard = async (data: ExamData): Promise<{ success: boolean; mode: 'html' | 'text' }> => {
  const htmlContent = generateWordHtml(data);
  const plainText = generatePlainText(data);

  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        }),
      ]);
      return { success: true, mode: 'html' };
    }
  } catch (err) {
    console.warn('ClipboardItem HTML copy failed, falling back to writeText:', err);
  }

  // Fallback to plain text
  try {
    await navigator.clipboard.writeText(plainText);
    return { success: true, mode: 'text' };
  } catch (err) {
    console.error('All clipboard operations failed:', err);
    return { success: false, mode: 'text' };
  }
};

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
