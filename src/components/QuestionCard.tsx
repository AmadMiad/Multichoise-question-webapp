import React from 'react';
import {
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Plus,
  CheckCircle,
  LayoutGrid,
  Columns,
  Rows,
  Sparkles,
} from 'lucide-react';
import { Question, LayoutMode, ExamSettings } from '../types/exam';
import {
  formatChoiceLabel,
  formatQuestionNumber,
  resolveLayout,
} from '../utils/kurdishUtils';

interface QuestionCardProps {
  question: Question;
  index: number;
  totalQuestions: number;
  settings: ExamSettings;
  onChange: (updated: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  totalQuestions,
  settings,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}) => {
  const qNumber = formatQuestionNumber(index + 1, settings.numberingStyle);
  const resolvedLayout = resolveLayout(question.layout, question.choices);

  const updateChoice = (choiceIndex: number, text: string) => {
    const newChoices = [...question.choices];
    newChoices[choiceIndex] = text;
    onChange({ ...question, choices: newChoices });
  };

  const addChoice = () => {
    if (question.choices.length < 6) {
      onChange({ ...question, choices: [...question.choices, ''] });
    }
  };

  const removeChoice = (choiceIndex: number) => {
    if (question.choices.length > 2) {
      const newChoices = question.choices.filter((_, i) => i !== choiceIndex);
      let newCorrect = question.correctIndex;
      if (newCorrect === choiceIndex) {
        newCorrect = null;
      } else if (newCorrect !== undefined && newCorrect !== null && newCorrect > choiceIndex) {
        newCorrect -= 1;
      }
      onChange({ ...question, choices: newChoices, correctIndex: newCorrect });
    }
  };

  const toggleCorrect = (choiceIndex: number) => {
    if (question.correctIndex === choiceIndex) {
      onChange({ ...question, correctIndex: null });
    } else {
      onChange({ ...question, correctIndex: choiceIndex });
    }
  };

  const setLayout = (layout: LayoutMode) => {
    onChange({ ...question, layout });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-5 mb-4 group">
      {/* Top Bar: Question Index & Actions */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm">
            {qNumber.replace('-', '')}
          </div>
          <span className="text-xs font-semibold text-slate-500">پرسیاری ژمارە {qNumber.replace('-', '')}</span>

          {/* Points / Marks */}
          <div className="flex items-center gap-1.5 mr-2">
            <input
              type="number"
              min="1"
              max="100"
              value={question.points || 2}
              onChange={(e) =>
                onChange({ ...question, points: parseInt(e.target.value, 10) || 1 })
              }
              className="w-14 px-2 py-0.5 text-xs text-center font-semibold rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              title="نمرەی پرسیار"
            />
            <span className="text-xs text-slate-400">نمرە</span>
          </div>
        </div>

        {/* Layout Mode Selector & Controls */}
        <div className="flex items-center gap-1">
          {/* Layout buttons */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg text-xs ml-3">
            <button
              type="button"
              onClick={() => setLayout('auto')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition ${
                question.layout === 'auto'
                  ? 'bg-white text-blue-600 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="ڕێکخستنی خودکار بەپێی درێژی دەقەکە"
            >
              <Sparkles className="w-3 h-3" />
              <span>خودکار</span>
            </button>
            <button
              type="button"
              onClick={() => setLayout('1-row')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition ${
                question.layout === '1-row'
                  ? 'bg-white text-blue-600 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="هەموو بژاردەکان لە یەک دێڕدا (١ دێڕ)"
            >
              <Columns className="w-3 h-3" />
              <span>١ دێڕ</span>
            </button>
            <button
              type="button"
              onClick={() => setLayout('2-row')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition ${
                question.layout === '2-row'
                  ? 'bg-white text-blue-600 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="دوو بژاردە لە هەر دێڕێکدا (٢ دێڕ)"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>٢ دێڕ</span>
            </button>
            <button
              type="button"
              onClick={() => setLayout('vertical')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition ${
                question.layout === 'vertical'
                  ? 'bg-white text-blue-600 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="هەر بژاردەیەک لەسەر دێڕێکی سەربەخۆ (ستوونی)"
            >
              <Rows className="w-3 h-3" />
              <span>ستوونی</span>
            </button>
          </div>

          {/* Move Up */}
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
            title="سەرخستن"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Move Down */}
          <button
            type="button"
            disabled={index === totalQuestions - 1}
            onClick={onMoveDown}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
            title="خوارخستن"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="لەبەرگرتنەوەی ئەم پرسیارە"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="سڕینەوەی ئەم پرسیارە"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Textarea */}
      <div className="mb-4">
        <textarea
          rows={2}
          value={question.text}
          onChange={(e) => onChange({ ...question, text: e.target.value })}
          placeholder="دەقی پرسیارەکە بنووسە... (بۆ نموونە: پایتەختی هەرێمی کوردستان کامەیە؟)"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder:text-slate-400 text-sm font-medium resize-y"
        />
      </div>

      {/* Choices Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <div className="flex items-center gap-2">
            <span>بژاردەکانی وەڵام:</span>
            <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
              شێوازی پیشاندان:{' '}
              {resolvedLayout === '1-row'
                ? '١ دێڕی تەواو'
                : resolvedLayout === '2-row'
                ? '٢ دێڕ (٢ ستوون)'
                : 'ستوونی'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            کرتە لە بازنەی سەوز بکە بۆ دیاریکردنی وەڵامی دروست
          </span>
        </div>

        <div
          className={`grid gap-2.5 ${
            resolvedLayout === '1-row'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : resolvedLayout === '2-row'
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1'
          }`}
        >
          {question.choices.map((choice, cIndex) => {
            const label = formatChoiceLabel(cIndex, settings.choiceMarker, settings.bracketStyle);
            const isCorrect = question.correctIndex === cIndex;

            return (
              <div
                key={cIndex}
                className={`flex items-center gap-2 p-1.5 pl-2 rounded-xl border transition-all ${
                  isCorrect
                    ? 'border-emerald-300 bg-emerald-50/50 ring-1 ring-emerald-200'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus-within:bg-white focus-within:border-blue-400'
                }`}
              >
                {/* Correct answer toggle button */}
                <button
                  type="button"
                  onClick={() => toggleCorrect(cIndex)}
                  className={`flex-shrink-0 p-1 rounded-lg transition ${
                    isCorrect
                      ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200'
                      : 'text-slate-300 hover:text-emerald-500 hover:bg-slate-200/50'
                  }`}
                  title={isCorrect ? 'وەڵامی دروست دیاریکراوە (کرتە بکە بۆ لابردن)' : 'دیاریکردن وەک وەڵامی دروست'}
                >
                  <CheckCircle className="w-4 h-4" />
                </button>

                {/* Choice Letter Label */}
                <span className="font-bold text-slate-700 text-xs flex-shrink-0 min-w-[24px]">
                  {label}
                </span>

                {/* Choice Input */}
                <input
                  type="text"
                  value={choice}
                  onChange={(e) => updateChoice(cIndex, e.target.value)}
                  placeholder={`بژاردەی ${label}`}
                  className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-sm text-slate-850 py-1 px-1 placeholder:text-slate-300"
                />

                {/* Remove choice button if > 2 */}
                {question.choices.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeChoice(cIndex)}
                    className="flex-shrink-0 text-slate-300 hover:text-rose-500 p-1 rounded transition opacity-50 hover:opacity-100"
                    title="سڕینەوەی ئەم بژاردەیە"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add choice button (if < 6) */}
        {question.choices.length < 6 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={addChoice}
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold px-2 py-1 rounded-lg hover:bg-blue-50 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>زیادکردنی بژاردەی نوێ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
