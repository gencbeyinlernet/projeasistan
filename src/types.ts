export type AppTab = 
  | "projects"        // TEKNOFEST & TÜBİTAK Proje Hazırlama
  | "social"          // Sosyal Sorumluluk & Okul Projeleri
  | "recycling"       // Geri Dönüşüm & Sıfır Atık
  | "english_vocab"   // İngilizce Kelime Ezberleme
  | "english_dialog"  // İngilizce İnteraktif Diyalog
  | "exam_study"      // Sınav Çalışma & Pomodoro
  | "exam_analysis";  // Deneme Sonuçları Analizi

export type StudentLevel = "Ortaokul" | "Lise" | "YKS / Üniversite Hazırlık";

export interface TeknofestProjectInput {
  competitionType: "TEKNOFEST" | "TUBITAK";
  category: string;
  studentLevel: StudentLevel;
  projectTitle: string;
  problemStatement: string;
  targetAudience: string;
  proposedSolution: string;
  technicalKeywords: string;
}

export interface SocialProjectInput {
  topic: string;
  schoolScope: string;
  targetBeneficiaries: string;
  durationWeeks: number;
}

export interface RecyclingProjectInput {
  wasteType: string;
  context: string;
  goal: string;
}

export interface EnglishWord {
  id: string;
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  meaningTr: string;
  exampleEn: string;
  exampleTr: string;
  category: "academic" | "science_tech" | "environment" | "social" | "ydt_exam" | "daily";
  level: "A1-A2" | "B1-B2" | "C1";
  learned?: boolean;
}

export interface DialogueMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface ExamScoreRecord {
  id: string;
  date: string;
  examName: string;
  examType: "TYT" | "AYT" | "LGS" | "YDT";
  subjects: {
    name: string;
    correct: number;
    incorrect: number;
    net: number;
  }[];
  totalNet: number;
  weakTopics: string;
  notes?: string;
}

export interface StudySessionRecord {
  id: string;
  date: string;
  subject: string;
  durationMinutes: number;
  questionsSolved: number;
}
