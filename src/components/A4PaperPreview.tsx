import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Copy,
  Check,
  FileCheck,
} from 'lucide-react';
import { ExamData, Question } from '../types/exam';
import {
  formatChoiceLabel,
  formatQuestionNumber,
  resolveLayout,
  toKurdishDigits,
} from '../utils/kurdishUtils';

interface A4PaperPreviewProps {
  data: ExamData;
  onCopyWord: () => void;
  onPrint: () => void;
  isCopied: boolean;
}

export const A4PaperPreview: React.FC<A4PaperPreviewProps> = ({
  data,
  onCopyWord,
  onPrint,
  isCopied,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const { header, settings, questions } = data;

  const fontSizes = {
    sm: { base: 'text-[12px]', q: 'text-[13px]', h: 'text-[13px]' },
    md: { base: 'text-[13.5px]', q: 'text-[14.5px]', h: 'text-[14px]' },
    lg: { base: 'text-[15px]', q: 'text-[16.5px]', h: 'text-[16px]' },
  };
  const sizeClasses = fontSizes[settings.fontSize] || fontSizes.md;

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 10, 140));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 10, 70));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className="flex flex-col h-full">
      {/* Top control bar for preview */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 print:hidden">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">
            پێشبینینی لاپەڕەی A4 (Live Preview)
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {toKurdishDigits(questions.length)} پرسیار
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs text-slate-600">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-white rounded transition text-slate-500 hover:text-slate-800"
              title="بچووککردنەوە"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-semibold text-[11px] min-w-[38px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-white rounded transition text-slate-500 hover:text-slate-800"
              title="گەورەکردنەوە"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 hover:bg-white rounded transition text-slate-500 hover:text-slate-800"
              title="قەبارەی بنەڕەتی"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Copy Word */}
          <button
            onClick={onCopyWord}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition ${
              isCopied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'کۆپی کرا' : 'کۆپیکردن'}</span>
          </button>

          {/* Print */}
          <button
            onClick={onPrint}
            className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition"
            title="چاپکردن"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* A4 Sheet Container with scroll and zoom */}
      <div className="flex-1 overflow-auto bg-slate-200/60 p-4 sm:p-6 rounded-2xl flex justify-center items-start print:p-0 print:bg-white">
        <div
          id="printable-a4-sheet"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className={`w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-xl border border-slate-300/70 p-[18mm] font-vazir leading-relaxed print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none ${sizeClasses.base}`}
          dir="rtl"
        >
          {/* Exam Header */}
          {header.enabled && (
            <div className="border-b-2 border-slate-900 pb-3 mb-5">
              <div className="flex justify-between items-start gap-4">
                {/* Right side: Directorate & School */}
                <div className="w-1/3 text-right">
                  {header.directorate && (
                    <div className="font-semibold text-slate-700 text-xs">{header.directorate}</div>
                  )}
                  {header.schoolName && (
                    <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                      {header.schoolName}
                    </div>
                  )}
                </div>

                {/* Center: Exam Type & Academic Year */}
                <div className="w-1/3 text-center">
                  {header.examType && (
                    <div className="font-bold text-slate-900 text-sm">{header.examType}</div>
                  )}
                  {header.academicYear && (
                    <div className="text-xs text-slate-700 mt-0.5">
                      ساڵی خوێندن: {header.academicYear}
                    </div>
                  )}
                </div>

                {/* Left side: Subject & Stage & Time */}
                <div className="w-1/3 text-left">
                  {header.subject && (
                    <div className="text-xs font-semibold">
                      <span className="text-slate-600">بابەت: </span>
                      <span className="font-bold text-slate-900">{header.subject}</span>
                    </div>
                  )}
                  {header.grade && (
                    <div className="text-xs font-semibold mt-0.5">
                      <span className="text-slate-600">پۆل: </span>
                      <span className="font-bold text-slate-900">{header.grade}</span>
                    </div>
                  )}
                  {header.timeAllowed && (
                    <div className="text-xs font-semibold mt-0.5">
                      <span className="text-slate-600">کات: </span>
                      <span className="font-bold text-slate-900">{header.timeAllowed}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-header: Teacher Name & Total Marks */}
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200 text-xs">
                <div>
                  {header.teacherName && (
                    <span>
                      <strong className="text-slate-800">مامۆستای بابەت: </strong>
                      {header.teacherName}
                    </span>
                  )}
                </div>
                <div>
                  {header.totalMarks && (
                    <span>
                      <strong className="text-slate-800">نمرەی گشتی: </strong>
                      {header.totalMarks}
                    </span>
                  )}
                </div>
              </div>

              {/* Instructions */}
              {header.instructions && (
                <div className="mt-2.5 pt-2 border-t border-dashed border-slate-300 font-semibold text-xs text-slate-800">
                  {header.instructions}
                </div>
              )}
            </div>
          )}

          {/* Empty state if no questions */}
          {questions.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              هیچ پرسیارێک زیاد نەکراوە. لە بەشی چەپەوە پرسیاری نوێ زیاد بکە!
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((question, qIndex) => {
              const qNum = formatQuestionNumber(qIndex + 1, settings.numberingStyle);
              const resolved = resolveLayout(question.layout, question.choices);

              return (
                <div key={question.id || qIndex} className="break-inside-avoid">
                  {/* Question Title & Points */}
                  <div className="flex items-start gap-1 font-bold text-slate-900 mb-1.5">
                    <span className="flex-shrink-0">{qNum}</span>
                    <span className="flex-1 leading-snug">{question.text || 'پرسیار بێ دەقە'}</span>
                    {settings.showPoints && question.points && (
                      <span className="text-xs font-normal text-slate-600 mr-2 flex-shrink-0">
                        ({toKurdishDigits(question.points)} نمرە)
                      </span>
                    )}
                  </div>

                  {/* Question Choices formatted into aligned columns */}
                  <div className="pr-4">
                    {renderPreviewChoices(question, resolved, settings)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const renderPreviewChoices = (
  question: Question,
  layout: '1-row' | '2-row' | 'vertical',
  settings: ExamData['settings']
) => {
  const choices = question.choices;

  if (layout === '1-row') {
    return (
      <div className="grid grid-cols-4 gap-2">
        {choices.map((choice, i) => {
          const label = formatChoiceLabel(i, settings.choiceMarker, settings.bracketStyle);
          const isCorrect = settings.showAnswerKey && question.correctIndex === i;
          return (
            <div
              key={i}
              className={`flex items-baseline gap-1.5 ${
                isCorrect ? 'text-emerald-700 font-bold underline' : 'text-slate-800'
              }`}
            >
              <span className="font-bold flex-shrink-0">{label}</span>
              <span className="truncate">{choice}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (layout === '2-row') {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
        {choices.map((choice, i) => {
          const label = formatChoiceLabel(i, settings.choiceMarker, settings.bracketStyle);
          const isCorrect = settings.showAnswerKey && question.correctIndex === i;
          return (
            <div
              key={i}
              className={`flex items-baseline gap-1.5 ${
                isCorrect ? 'text-emerald-700 font-bold underline' : 'text-slate-800'
              }`}
            >
              <span className="font-bold flex-shrink-0">{label}</span>
              <span>{choice}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical layout
  return (
    <div className="space-y-1">
      {choices.map((choice, i) => {
        const label = formatChoiceLabel(i, settings.choiceMarker, settings.bracketStyle);
        const isCorrect = settings.showAnswerKey && question.correctIndex === i;
        return (
          <div
            key={i}
            className={`flex items-baseline gap-1.5 ${
              isCorrect ? 'text-emerald-700 font-bold underline' : 'text-slate-800'
            }`}
          >
            <span className="font-bold flex-shrink-0">{label}</span>
            <span>{choice}</span>
          </div>
        );
      })}
    </div>
  );
};
