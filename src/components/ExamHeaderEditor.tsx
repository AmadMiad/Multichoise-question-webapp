import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileSpreadsheet, Eye, EyeOff } from 'lucide-react';
import { ExamHeader } from '../types/exam';

interface ExamHeaderEditorProps {
  header: ExamHeader;
  onChange: (header: ExamHeader) => void;
}

export const ExamHeaderEditor: React.FC<ExamHeaderEditorProps> = ({ header, onChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  const updateField = (field: keyof ExamHeader, value: string | boolean) => {
    onChange({
      ...header,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6 transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              زانیاری و سەردێڕی تاقیکردنەوە (Exam Header)
            </h2>
            <p className="text-xs text-slate-500">
              ناوی قوتابخانە، بابەت، پۆل، کاتی دیاریکراو و نمرەکان
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Enable / Disable */}
          <button
            type="button"
            onClick={() => updateField('enabled', !header.enabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              header.enabled
                ? 'bg-blue-100/80 text-blue-700 hover:bg-blue-200/70'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {header.enabled ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>چالاکە</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>ناچالاکە</span>
              </>
            )}
          </button>

          {/* Expand / Collapse */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Form Fields */}
      {isOpen && header.enabled && (
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm animate-in fade-in duration-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ناوی قوتابخانە یان پەیمانگە
            </label>
            <input
              type="text"
              value={header.schoolName}
              onChange={(e) => updateField('schoolName', e.target.value)}
              placeholder="بۆ نموونە: ئامادەیی کوردستان"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              بەڕێوەبەرایەتی پەروەردە
            </label>
            <input
              type="text"
              value={header.directorate}
              onChange={(e) => updateField('directorate', e.target.value)}
              placeholder="بۆ نموونە: بەڕێوەبەرایەتی گشتی پەروەردەی هەولێر"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              بابەتی تاقیکردنەوە
            </label>
            <input
              type="text"
              value={header.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              placeholder="بۆ نموونە: زمانی کوردی / فیزیا"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              پۆل و قۆناغ
            </label>
            <input
              type="text"
              value={header.grade}
              onChange={(e) => updateField('grade', e.target.value)}
              placeholder="بۆ نموونە: پۆلی ١٢ی زانستی"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              جۆری تاقیکردنەوە
            </label>
            <input
              type="text"
              value={header.examType}
              onChange={(e) => updateField('examType', e.target.value)}
              placeholder="بۆ نموونە: تاقیکردنەوەی وەرزی یەکەم - خولی یەکەم"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ساڵی خوێندن
            </label>
            <input
              type="text"
              value={header.academicYear}
              onChange={(e) => updateField('academicYear', e.target.value)}
              placeholder="بۆ نموونە: ٢٠٢٥ - ٢٠٢٦"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              کاتی دیاریکراو
            </label>
            <input
              type="text"
              value={header.timeAllowed}
              onChange={(e) => updateField('timeAllowed', e.target.value)}
              placeholder="بۆ نموونە: ٢ کاتژمێر"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              مامۆستای بابەت
            </label>
            <input
              type="text"
              value={header.teacherName}
              onChange={(e) => updateField('teacherName', e.target.value)}
              placeholder="بۆ نموونە: م. هۆگر نەوزاد"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              نمرەی گشتی
            </label>
            <input
              type="text"
              value={header.totalMarks}
              onChange={(e) => updateField('totalMarks', e.target.value)}
              placeholder="بۆ نموونە: ٥٠ نمرە"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              تێبینی و ڕێنمایی گشتی
            </label>
            <input
              type="text"
              value={header.instructions}
              onChange={(e) => updateField('instructions', e.target.value)}
              placeholder="بۆ نموونە: وەڵامی ڕاست بۆ هەریەک لەم پرسیارانەی خوارەوە هەڵبژێرە:"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};
