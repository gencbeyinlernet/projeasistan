import React from "react";
import { 
  Rocket, 
  HeartHandshake, 
  Recycle, 
  Languages, 
  MessageSquareQuote, 
  Timer, 
  TrendingUp, 
  GraduationCap,
  Sparkles,
  BookOpen
} from "lucide-react";
import { AppTab, StudentLevel } from "../types";

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  studentLevel: StudentLevel;
  setStudentLevel: (level: StudentLevel) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  studentLevel,
  setStudentLevel,
}) => {
  const navItems: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "projects",
      label: "TEKNOFEST & TÜBİTAK",
      icon: <Rocket className="w-4 h-4 text-rose-500" />,
      badge: "Öncelikli",
    },
    {
      id: "social",
      label: "Sosyal Sorumluluk",
      icon: <HeartHandshake className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: "recycling",
      label: "Geri Dönüşüm & Çevre",
      icon: <Recycle className="w-4 h-4 text-teal-500" />,
    },
    {
      id: "english_vocab",
      label: "İngilizce Kelime",
      icon: <Languages className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: "english_dialog",
      label: "İngilizce Diyalog",
      icon: <MessageSquareQuote className="w-4 h-4 text-violet-500" />,
      badge: "AI Partner",
    },
    {
      id: "exam_study",
      label: "Sınav Çalışma & Pomodoro",
      icon: <Timer className="w-4 h-4 text-amber-500" />,
    },
    {
      id: "exam_analysis",
      label: "Deneme Analizi",
      icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
      badge: "Koç",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 font-['Outfit']">
                  Öğrenci Akademi & Proje
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                  <Sparkles className="w-3 h-3" /> TEKNOFEST & TÜBİTAK
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Bilimsel Araştırma, Sosyal Sorumluluk, Dil & Sınav Rehberi
              </p>
            </div>
          </div>

          {/* Kademe Selector & Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 pl-2 font-medium flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Kademe:
              </span>
              {(["Ortaokul", "Lise", "YKS / Üniversite Hazırlık"] as StudentLevel[]).map((level) => (
                <button
                  key={level}
                  id={`level-btn-${level.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setStudentLevel(level)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    studentLevel === level
                      ? "bg-white text-indigo-700 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100">
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive
                        ? "bg-rose-500 text-white"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
