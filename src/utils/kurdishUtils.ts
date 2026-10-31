import { ChoiceMarker, BracketStyle, NumberingStyle, LayoutMode, ExamData } from '../types/exam';

export const toKurdishDigits = (num: number | string): string => {
  const kurdishDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .replace(/[0-9]/g, (w) => kurdishDigits[parseInt(w, 10)]);
};

export const getChoiceLetter = (index: number, marker: ChoiceMarker): string => {
  const markers: Record<ChoiceMarker, string[]> = {
    alif_ba: ['ا', 'ب', 'ج', 'د', 'هـ', 'و'],
    hamza_alif: ['ئـ', 'ب', 'ج', 'د', 'هـ', 'و'],
    alif_hamza: ['أ', 'ب', 'ج', 'د', 'هـ', 'و'],
    latin: ['A', 'B', 'C', 'D', 'E', 'F'],
    arabic_indic_num: ['١', '٢', '٣', '٤', '٥', '٦'],
    latin_num: ['1', '2', '3', '4', '5', '6'],
  };

  const list = markers[marker] || markers.alif_ba;
  return list[index % list.length];
};

export const formatChoiceLabel = (
  index: number,
  marker: ChoiceMarker,
  bracket: BracketStyle
): string => {
  const letter = getChoiceLetter(index, marker);
  switch (bracket) {
    case 'parentheses':
      return `(${letter})`;
    case 'brackets':
      return `[${letter}]`;
    case 'dash':
      return `${letter} -`;
    case 'dot':
    default:
      return `${letter}.`;
  }
};

export const formatQuestionNumber = (
  num: number,
  style: NumberingStyle
): string => {
  const formatted = style === 'kurdish' ? toKurdishDigits(num) : num.toString();
  return `${formatted}-`;
};

export const resolveLayout = (
  layout: LayoutMode,
  choices: string[]
): '1-row' | '2-row' | 'vertical' => {
  if (layout !== 'auto') {
    return layout;
  }
  const maxLen = Math.max(...choices.map((c) => (c ? c.trim().length : 0)), 0);
  if (maxLen <= 14 && choices.length <= 4) {
    return '1-row';
  }
  if (maxLen <= 32 && choices.length <= 4) {
    return '2-row';
  }
  return 'vertical';
};

export const DEFAULT_SAMPLE_EXAM: ExamData = {
  header: {
    enabled: true,
    schoolName: 'ئامادەیی کوردستانـی کوڕان',
    directorate: 'بەڕێوەبەرایەتی گشتی پەروەردەی هەولێر',
    subject: 'زمانی کوردی',
    grade: 'پۆلی دوازدەهەم (زانستی و وێژەیی)',
    examType: 'تاقیکردنەوەی وەرزی یەکەم - خولی یەکەم',
    academicYear: '٢٠٢٥ - ٢٠٢٦',
    timeAllowed: '٢ کاتژمێر',
    teacherName: 'مامۆستا دیار ئازاد',
    totalMarks: '٢٠ نمرە',
    instructions: 'وەڵامی ڕاست بۆ هەریەک لەم پرسیارانەی خوارەوە دیاری بکە:',
  },
  settings: {
    choiceMarker: 'alif_ba',
    bracketStyle: 'parentheses',
    numberingStyle: 'kurdish',
    paperSize: 'a4',
    fontSize: 'md',
    lineSpacing: 'normal',
    showAnswerKey: false,
    showPoints: true,
    autoDetectLayout: true,
  },
  questions: [
    {
      id: 'q-1',
      text: 'یەکەم ڕۆژنامەی کوردی بە ناوی چ بوو و لە چ ساڵێکدا دەرچوو؟',
      choices: [
        'ڕۆژنامەی کوردستان (١٨٩٨)',
        'ڕۆژنامەی هاوکاری (١٩٧٠)',
        'ڕۆژنامەی برایەتی (١٩٩٢)',
        'ڕۆژنامەی پێشکەوتن (١٩٢٠)',
      ],
      layout: 'auto',
      correctIndex: 0,
      points: 2,
    },
    {
      id: 'q-2',
      text: 'پایتەختی هەرێمی کوردستان کام شارەیە؟',
      choices: ['هەولێر', 'سلێمانی', 'دهۆک', 'کەرکووک'],
      layout: 'auto',
      correctIndex: 0,
      points: 2,
    },
    {
      id: 'q-3',
      text: 'شاعیری ناوداری کورد مەولەوی، سەر بە کام قوتابخانە و شێوەزاری ئەدەبییە؟',
      choices: [
        'گۆرانی (هەورامی)',
        'کوردیی ناوەڕاست (سۆرانی)',
        'کوردیی باکوور (کرمانجی)',
        'کەلھوڕی',
      ],
      layout: 'auto',
      correctIndex: 0,
      points: 2,
    },
    {
      id: 'q-4',
      text: 'لە ڕستەی «قوتابییە زیرەکەکە وانەکەی بە باشی خوێندەوە»، وشەی «زیرەکەکە» چ ڕۆڵێکی ڕێزمانی هەیە؟',
      choices: [
        'سەرکردەی کردار',
        'ئاوەڵناوی دیاریکراو بۆ بکەر',
        'ئاوەڵکار بۆ کردار',
        'بەرکاری ڕاستەوخۆ',
      ],
      layout: 'auto',
      correctIndex: 1,
      points: 2,
    },
  ],
};
