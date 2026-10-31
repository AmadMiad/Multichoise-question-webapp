import React, { useRef } from 'react';
import {
  X,
  Sliders,
  Download,
  Upload,
} from 'lucide-react';
import {
  ExamSettings,
  ChoiceMarker,
  BracketStyle,
  NumberingStyle,
  FontSize,
  ExamData,
} from '../types/exam';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ExamSettings;
  onUpdateSettings: (newSettings: ExamSettings) => void;
  examData: ExamData;
  onImportExam: (importedData: ExamData) => void;
  onShowToast: (text: string, type: 'success' | 'error') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  examData,
  onImportExam,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const update = <K extends keyof ExamSettings>(key: K, value: ExamSettings[K]) => {
    onUpdateSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleExportJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(examData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `kurdish_exam_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      onShowToast('تاقیکردنەوەکە وەک فایلی JSON دابەزێندرا', 'success');
    } catch {
      onShowToast('کێشەیەک لە هەناردەکردندا ڕوویدا', 'error');
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          onImportExam(parsed);
          onShowToast('تاقیکردنەوەکە بە سەرکەوتوویی هاوردە کرا', 'success');
          onClose();
        } else {
          onShowToast('فایلەکە دروست نییە', 'error');
        }
      } catch {
        onShowToast('هەڵە لە خوێندنەوەی فایلەکەدا هەیە', 'error');
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">ڕێکخستنەکانی شێواز و فۆرمات</h2>
              <p className="text-xs text-slate-500">نیشانەی بژاردەکان، شێوازی ژمارە و فۆنت دیاری بکە</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-5 space-y-5 text-sm">
          {/* Choice Marker Alphabet */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              پیت و نیشانەی بژاردەکان (Choice Marker):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'alif_ba', label: 'ا، ب، ج، د (ئەلف)' },
                { id: 'hamza_alif', label: 'ئـ، ب، ج، د (هەمزە)' },
                { id: 'alif_hamza', label: 'أ، ب، ج، د (ئەلف سەر)' },
                { id: 'latin', label: 'A, B, C, D (لاتینی)' },
                { id: 'arabic_indic_num', label: '١، ٢، ٣، ٤ (ژمارە)' },
                { id: 'latin_num', label: '1, 2, 3, 4 (English)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update('choiceMarker', item.id as ChoiceMarker)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition ${
                    settings.choiceMarker === item.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bracket Style */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              شێوازی کەوانەی بژاردەکان:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'parentheses', label: '(ا) کەوانە' },
                { id: 'brackets', label: '[ا] چوارگۆشە' },
                { id: 'dash', label: 'ا - هێڵ' },
                { id: 'dot', label: 'ا. خاڵ' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update('bracketStyle', item.id as BracketStyle)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition ${
                    settings.bracketStyle === item.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Numbering Style */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              شێوازی ژمارەدانانی پرسیارەکان:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'kurdish', label: 'ژمارەی کوردی (١-، ٢-، ٣-)' },
                { id: 'english', label: 'ژمارەی ئینگلیزی (1-, 2-, 3-)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update('numberingStyle', item.id as NumberingStyle)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition ${
                    settings.numberingStyle === item.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">قەبارەی دەق:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sm', label: 'بچووک (11pt)' },
                { id: 'md', label: 'ناوەند (12pt)' },
                { id: 'lg', label: 'گەورە (14pt)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update('fontSize', item.id as FontSize)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition ${
                    settings.fontSize === item.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-slate-700">
                پیشاندانی نمرە لە تەنیشت پرسیارەکان
              </span>
              <input
                type="checkbox"
                checked={settings.showPoints}
                onChange={(e) => update('showPoints', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">
                  پیشاندانی کلیل و وەڵامی دروست لە لاپەڕەدا
                </span>
                <span className="text-[11px] text-slate-400">
                  (بۆ پێداچوونەوەی مامۆستا، لە کاتی کۆپیکردندا بە سەوزی دەمێنێتەوە)
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.showAnswerKey}
                onChange={(e) => update('showAnswerKey', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Export / Import Section */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              پاشەکەوتکردن و گواستنەوەی فایل (Backup):
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>دابەزاندنی JSON</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>هاوردەکردنی JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            داخستن و جێبەجێکردن
          </button>
        </div>
      </div>
    </div>
  );
};
