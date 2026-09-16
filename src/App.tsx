import React, { useState } from "react";
import { AppTab, StudentLevel } from "./types";
import { Header } from "./components/Header";
import { ProjectLab } from "./components/ProjectLab";
import { SocialResponsibility } from "./components/SocialResponsibility";
import { RecyclingWorkshop } from "./components/RecyclingWorkshop";
import { EnglishVocabWorkshop } from "./components/EnglishVocabWorkshop";
import { EnglishDialogue } from "./components/EnglishDialogue";
import { ExamStudySuite } from "./components/ExamStudySuite";
import { ExamScoreAnalysis } from "./components/ExamScoreAnalysis";
import { 
  Rocket, 
  HeartHandshake, 
  Recycle, 
  Languages, 
  MessageSquareQuote, 
  Timer, 
  TrendingUp, 
  ExternalLink,
  BookOpen,
  Sparkles
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("projects");
  const [studentLevel, setStudentLevel] = useState<StudentLevel>("Lise");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Sticky Header with Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentLevel={studentLevel}
        setStudentLevel={setStudentLevel}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === "projects" && <ProjectLab studentLevel={studentLevel} />}
        {activeTab === "social" && <SocialResponsibility />}
        {activeTab === "recycling" && <RecyclingWorkshop />}
        {activeTab === "english_vocab" && <EnglishVocabWorkshop />}
        {activeTab === "english_dialog" && <EnglishDialogue />}
        {activeTab === "exam_study" && <ExamStudySuite />}
        {activeTab === "exam_analysis" && <ExamScoreAnalysis />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Öğrenci Akademi & Proje Platformu</span>
              <span>•</span>
              <span>TEKNOFEST, TÜBİTAK, Sosyal Sorumluluk, Dil & Sınav Koçu</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://scholar.google.com/scholar_labs/search?hl=tr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors"
              >
                <span>Google Scholar Labs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://consensus.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 flex items-center gap-1 font-medium transition-colors"
              >
                <span>Consensus AI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400">
                Öğretmen ve Öğrenci Bilimsel Çalışma Portalı
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
