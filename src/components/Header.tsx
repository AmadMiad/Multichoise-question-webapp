import React from 'react';
import {
  Copy,
  Printer,
  FileText,
  RotateCcw,
  Settings,
  Trash2,
  Sparkles,
  Check,
} from 'lucide-react';

interface HeaderProps {
  onCopyWord: () => void;
  onCopyPlainText: () => void;
  onPrint: () => void;
  onResetSample: () => void;
  onClearAll: () => void;
  onOpenSettings: () => void;
  isCopied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onCopyWord,
  onCopyPlainText,
  onPrint,
  onResetSample,
  onClearAll,
  onOpenSettings,
  isCopied,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  دروستکەری پرسیارەکانی هەڵبژاردن
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                  RTL Kurdish MCQ
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ڕێکخستنی خودکاری ستوونی بژاردەکان بەبێ دەستکاری فەزای Space و Tab - ئامادە بۆ وۆرد و گووگڵ دۆکس
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Word Copy Button */}
            <button
              onClick={onCopyWord}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md ${
                isCopied
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20 ring-2 ring-emerald-300'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 active:scale-95'
              }`}
              title="کۆپیکردنی دەقی ڕێکخراو لەگەڵ خشتەی شاراوە بۆ وۆرد و گووگڵ دۆکس"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'کۆپی کرا!' : 'کۆپیکردن بۆ وۆرد / دۆکس'}</span>
            </button>

            {/* Plain Text Copy */}
            <button
              onClick={onCopyPlainText}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition active:scale-95"
              title="کۆپیکردنی دەقی ئاسایی بە تاب"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">دەقی ئاسایی</span>
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition active:scale-95"
              title="چاپکردن یان پاشەکەوتکردن بە فۆرماتی PDF"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">چاپ / PDF</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition active:scale-95"
              title="ڕێکخستنەکانی فۆنت و نیشانەی بژاردەکان"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">ڕێکخستن</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            {/* Sample Exam Button */}
            <button
              onClick={onResetSample}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl hover:bg-slate-100 text-slate-600 text-sm transition"
              title="هێنانەوەی نموونەی ئامادەکراوی تاقیکردنەوە"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span className="hidden lg:inline text-xs">نموونە</span>
            </button>

            {/* Clear All */}
            <button
              onClick={onClearAll}
              className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
              title="سڕینەوەی سەرجەم پرسیارەکان"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
