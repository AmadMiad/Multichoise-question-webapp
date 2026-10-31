import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  HelpCircle,
  Eye,
  Edit3,
} from 'lucide-react';
import { ExamData, Question, ExamHeader, ExamSettings } from './types/exam';
import { DEFAULT_SAMPLE_EXAM, toKurdishDigits } from './utils/kurdishUtils';
import { copyExamToClipboard, generatePlainText } from './utils/clipboard';
import { Header } from './components/Header';
import { ExamHeaderEditor } from './components/ExamHeaderEditor';
import { QuestionCard } from './components/QuestionCard';
import { A4PaperPreview } from './components/A4PaperPreview';
import { SettingsModal } from './components/SettingsModal';
import { Toast, ToastMessage } from './components/Toast';

const STORAGE_KEY = 'kurdish_mcq_exam_v1';

export const App: React.FC = () => {
  const [examData, setExamData] = useState<ExamData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved exam:', e);
    }
    return DEFAULT_SAMPLE_EXAM;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(examData));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [examData]);

  // Toast Helper
  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info', subtext?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, text, type, subtext }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Header update
  const handleHeaderChange = (header: ExamHeader) => {
    setExamData((prev) => ({ ...prev, header }));
  };

  // Settings update
  const handleSettingsChange = (settings: ExamSettings) => {
    setExamData((prev) => ({ ...prev, settings }));
  };

  // Add Question
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      choices: ['', '', '', ''],
      layout: 'auto',
      correctIndex: null,
      points: 2,
    };
    setExamData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    showToast('پرسیاری نوێ زیاد کرا', 'info');
  };

  // Update specific question
  const handleUpdateQuestion = (index: number, updated: Question) => {
    setExamData((prev) => {
      const questions = [...prev.questions];
      questions[index] = updated;
      return { ...prev, questions };
    });
  };

  // Delete question
  const handleDeleteQuestion = (index: number) => {
    setExamData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
    showToast('پرسیارەکە سڕایەوە', 'info');
  };

  // Duplicate question
  const handleDuplicateQuestion = (index: number) => {
    const original = examData.questions[index];
    const duplicated: Question = {
      ...original,
      id: `q-${Date.now()}`,
      text: `${original.text} (لەبەرگیراوە)`,
    };
    setExamData((prev) => {
      const questions = [...prev.questions];
      questions.splice(index + 1, 0, duplicated);
      return { ...prev, questions };
    });
    showToast('لەبەرگیراوەی پرسیارەکە زیاد کرا', 'info');
  };

  // Move Question Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setExamData((prev) => {
      const questions = [...prev.questions];
      const temp = questions[index - 1];
      questions[index - 1] = questions[index];
      questions[index] = temp;
      return { ...prev, questions };
    });
  };

  // Move Question Down
  const handleMoveDown = (index: number) => {
    if (index === examData.questions.length - 1) return;
    setExamData((prev) => {
      const questions = [...prev.questions];
      const temp = questions[index + 1];
      questions[index + 1] = questions[index];
      questions[index] = temp;
      return { ...prev, questions };
    });
  };

  // Copy for Word / Docs
  const handleCopyWord = async () => {
    if (examData.questions.length === 0) {
      showToast('تکایە سەرەتا چەند پرسیارێک زیاد بکە', 'error');
      return;
    }

    const res = await copyExamToClipboard(examData);
    if (res.success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
      showToast(
        'پرسیارەکان بە سەرکەوتوویی کۆپی کران! ✨',
        'success',
        'دەتوانیت بچیتە ناو Microsoft Word یان Google Docs و (Ctrl + V) لێبدەیت. هەڵبژاردنەکان بە ڕێکی ستوونی دەمێننەوە.'
      );
    } else {
      showToast('کێشەیەک لە کۆپیکردندا ڕوویدا', 'error');
    }
  };

  // Copy Plain Text
  const handleCopyPlainText = async () => {
    if (examData.questions.length === 0) {
      showToast('تکایە سەرەتا چەند پرسیارێک زیاد بکە', 'error');
      return;
    }
    try {
      const plain = generatePlainText(examData);
      await navigator.clipboard.writeText(plain);
      showToast('دەقی ئاسایی کۆپی کرا', 'success', 'دەتوانیت لە هەر جێگەیەک Paste بکەیت');
    } catch {
      showToast('نەتوانرا دەقەکە کۆپی بکرێت', 'error');
    }
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Reset to Sample
  const handleResetSample = () => {
    if (window.confirm('ئایا دڵنیایت دەتەوێت پرسیارە نموونەییەکان بگەڕێنیتەوە؟')) {
      setExamData(DEFAULT_SAMPLE_EXAM);
      showToast('نموونەی پرسیارەکان گەڕێندرانەوە', 'success');
    }
  };

  // Clear All
  const handleClearAll = () => {
    if (window.confirm('ئایا دڵنیایت دەتەوێت سەرجەم پرسیارەکان بسڕیتەوە؟')) {
      setExamData((prev) => ({
        ...prev,
        questions: [],
      }));
      showToast('سەرجەم پرسیارەکان سڕانەوە', 'info');
    }
  };

  // Keyboard shortcut: Ctrl + Enter to add question
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleAddQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-vazir" dir="rtl">
      {/* Top Navigation */}
      <Header
        onCopyWord={handleCopyWord}
        onCopyPlainText={handleCopyPlainText}
        onPrint={handlePrint}
        onResetSample={handleResetSample}
        onClearAll={handleClearAll}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isCopied={isCopied}
      />

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-center gap-2 print:hidden">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition flex-1 justify-center ${
            mobileTab === 'editor'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>دەستکاری پرسیارەکان</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition flex-1 justify-center ${
            mobileTab === 'preview'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>پێشبینینی A4</span>
        </button>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Question Editor (7 columns on desktop) */}
          <div
            className={`lg:col-span-7 space-y-4 print:hidden ${
              mobileTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Exam Header Form */}
            <ExamHeaderEditor
              header={examData.header}
              onChange={handleHeaderChange}
            />

            {/* Questions Header & Quick Actions */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-800">
                  پرسیارەکانی هەڵبژاردن
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                  {toKurdishDigits(examData.questions.length)} پرسیار
                </span>
              </div>

              <div className="text-xs text-slate-400 hidden sm:block">
                <span>کورتەڕێ: </span>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-600 font-mono text-[11px]">
                  Ctrl + Enter
                </kbd>
                <span> بۆ پرسیاری نوێ</span>
              </div>
            </div>

            {/* Questions Cards */}
            {examData.questions.map((question, index) => (
              <QuestionCard
                key={question.id || index}
                question={question}
                index={index}
                totalQuestions={examData.questions.length}
                settings={examData.settings}
                onChange={(updated) => handleUpdateQuestion(index, updated)}
                onDelete={() => handleDeleteQuestion(index)}
                onDuplicate={() => handleDuplicateQuestion(index)}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
              />
            ))}

            {/* Add Question Button */}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-4 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center gap-2 transition duration-200 active:scale-[0.99] shadow-xs"
            >
              <Plus className="w-5 h-5" />
              <span>زیادکردنی پرسیاری نوێ</span>
            </button>

            {/* Tip Card for Teachers */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3 mt-6">
              <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <p className="font-bold text-amber-950 mb-1">
                  چۆن کار دەکات؟ بۆچی لە وۆرد تێک ناچێت؟
                </p>
                <p>
                  لەبری ئەوەی بە دەست Space و Tab لێبدەیت، ئەم ئامرازە بە شێوەیەکی خۆکارانە خشتەیەکی بێ‌سنوور (Invisible Table) دروست دەکات. کاتێک دوگمەی «کۆپیکردن بۆ وۆرد / دۆکس» دەدەیت و لە وۆرد Paste دەکەیت، ستوونی هەڵبژاردنەکان (ا، ب، ج، د) بە نەگۆڕی لە جێگەی خۆیاندا دەمێننەوە بێ ئەوەی خوار ببن یان بکەونە سەر دێڕی تر.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: A4 Live Preview (5 columns on desktop, sticky) */}
          <div
            className={`lg:col-span-5 lg:sticky lg:top-20 max-h-[calc(100vh-6rem)] flex flex-col ${
              mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <A4PaperPreview
              data={examData}
              onCopyWord={handleCopyWord}
              onPrint={handlePrint}
              isCopied={isCopied}
            />
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={examData.settings}
        onUpdateSettings={handleSettingsChange}
        examData={examData}
        onImportExam={setExamData}
        onShowToast={(msg, type) => showToast(msg, type)}
      />

      {/* Floating Toast Notification */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
