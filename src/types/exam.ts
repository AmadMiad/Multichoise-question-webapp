export type ChoiceMarker = 'alif_ba' | 'hamza_alif' | 'alif_hamza' | 'latin' | 'arabic_indic_num' | 'latin_num';

export type BracketStyle = 'parentheses' | 'dash' | 'dot' | 'brackets';

export type NumberingStyle = 'kurdish' | 'english';

export type LayoutMode = 'auto' | '1-row' | '2-row' | 'vertical';

export type PaperSize = 'a4' | 'letter';

export type FontSize = 'sm' | 'md' | 'lg';

export interface Question {
  id: string;
  text: string;
  choices: string[];
  layout: LayoutMode;
  correctIndex?: number | null;
  points?: number;
}

export interface ExamHeader {
  enabled: boolean;
  schoolName: string;       // ناوی قوتابخانە / پەیمانگە
  directorate: string;      // بەڕێوەبەرایەتی پەروەردە
  subject: string;          // بابەت
  grade: string;            // پۆل / قۆناغ
  examType: string;         // تاقیکردنەوەی خولی یەکەم / دووەم / وەرز
  academicYear: string;     // ساڵی خوێندن
  timeAllowed: string;      // کاتی دیاریکراو
  teacherName: string;      // ناوی مامۆستا
  totalMarks: string;       // نمرەی گشتی
  instructions: string;     // تێبینی گشتی
}

export interface ExamSettings {
  choiceMarker: ChoiceMarker;
  bracketStyle: BracketStyle;
  numberingStyle: NumberingStyle;
  paperSize: PaperSize;
  fontSize: FontSize;
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  showAnswerKey: boolean;
  showPoints: boolean;
  autoDetectLayout: boolean;
}

export interface ExamData {
  header: ExamHeader;
  settings: ExamSettings;
  questions: Question[];
}
