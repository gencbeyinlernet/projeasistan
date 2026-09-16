import React, { useState, useEffect } from "react";
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
  BookOpen,
  Menu,
  X,
  ChevronDown,
  Check,
  ExternalLink
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems: { 
    id: AppTab; 
    label: string; 
    shortDesc: string;
    icon: React.ReactNode; 
    badge?: string;
    accentColor: string;
    bgColor: string;
  }[] = [
    {
      id: "projects",
      label: "TEKNOFEST & TÜBİTAK",
      shortDesc: "Bilimsel Proje Raporu & Literatür Taraması",
      icon: <Rocket className="w-4 h-4 text-rose-500" />,
      badge: "Öncelikli",
      accentColor: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      id: "social",
      label: "Sosyal Sorumluluk",
      shortDesc: "Toplum & Okul Projeleri Eylem Planı",
      icon: <HeartHandshake className="w-4 h-4 text-emerald-500" />,
      accentColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      id: "recycling",
      label: "Geri Dönüşüm & Çevre",
      shortDesc: "Sıfır Atık, Upcycling & Eko-Hesaplayıcı",
      icon: <Recycle className="w-4 h-4 text-teal-500" />,
      accentColor: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      id: "english_vocab",
      label: "İngilizce Kelime",
      shortDesc: "Flashcard Ezberleme & Kelime Testi",
      icon: <Languages className="w-4 h-4 text-indigo-500" />,
      accentColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      id: "english_dialog",
      label: "İngilizce Diyalog",
      shortDesc: "Yapay Zeka ile Sesli/Yazılı Konuşma Partneri",
      icon: <MessageSquareQuote className="w-4 h-4 text-violet-500" />,
      badge: "AI Partner",
      accentColor: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      id: "exam_study",
      label: "Sınav Çalışma & Pomodoro",
      shortDesc: "Odaklanma Zamanlayıcısı & Soru Takibi",
      icon: <Timer className="w-4 h-4 text-amber-500" />,
      accentColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      id: "exam_analysis",
      label: "Deneme Analizi",
      shortDesc: "Net Grafiği & Yapay Zeka Sınav Koçu",
      icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
      badge: "Koç",
      accentColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  const currentItem = navItems.find((item) => item.id === activeTab) || navItems[0];

  const handleSelectTab = (tabId: AppTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ======================================================== */}
        {/* DESKTOP & TABLET TOP ROW (md: and above)                 */}
        {/* ======================================================== */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
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
              <p className="text-xs text-slate-500">
                Bilimsel Araştırma, Sosyal Sorumluluk, Dil & Sınav Rehberi
              </p>
            </div>
          </div>

          {/* Kademe Selector (Desktop) */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 pl-2 font-medium flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Kademe:
            </span>
            {(["Ortaokul", "Lise", "YKS / Üniversite Hazırlık"] as StudentLevel[]).map((level) => (
              <button
                key={level}
                id={`level-btn-${level.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setStudentLevel(level)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
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

        {/* ======================================================== */}
        {/* DESKTOP HORIZONTAL NAVIGATION TABS (md: and above)       */}
        {/* ======================================================== */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100">
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
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

        {/* ======================================================== */}
        {/* MOBILE TOP BAR (below md:)                                */}
        {/* ======================================================== */}
        <div className="flex md:hidden items-center justify-between h-15">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-900 font-['Outfit'] block leading-tight">
                Öğrenci Akademi
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {studentLevel} Kademesi
              </span>
            </div>
          </div>

          {/* Mobile Actions: Kademe Chip & Hamburger Button */}
          <div className="flex items-center gap-2">
            {/* Quick Level Badge */}
            <span className="px-2 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {studentLevel.split(" ")[0]}
            </span>

            {/* Hamburger Button */}
            <button
              type="button"
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200/80 cursor-pointer flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-800" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" />
              )}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE ACTIVE TAB TRIGGER BAR (below md:)                 */}
        {/* ======================================================== */}
        <div className="md:hidden border-t border-slate-100 py-1.5">
          <button
            type="button"
            id="mobile-active-tab-selector-bar"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition-all cursor-pointer border border-slate-200/60"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="shrink-0">{currentItem.icon}</span>
              <span className="truncate font-bold text-slate-900">{currentItem.label}</span>
              {currentItem.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 shrink-0">
                  {currentItem.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-bold shrink-0 pl-2">
              <span>Tüm Bölümler (7)</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE DROPDOWN DRAWER / ACCORDION MENU                  */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 space-y-4">
            {/* Student Level Selector on Mobile */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Öğrenci Kademesi Seçimi:</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(["Ortaokul", "Lise", "YKS / Üniversite Hazırlık"] as StudentLevel[]).map((level) => {
                  const isLvlActive = studentLevel === level;
                  const label = level === "YKS / Üniversite Hazırlık" ? "YKS / Üniv." : level;
                  return (
                    <button
                      key={level}
                      id={`mobile-level-${level.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setStudentLevel(level)}
                      className={`py-2 px-1.5 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                        isLvlActive
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of All 7 Sections */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                <span>Uygulama Alanları (7 Bölüm)</span>
                <span className="text-[11px] text-slate-400 font-normal">Bir alana dokunun</span>
              </div>

              {navItems.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`mobile-menu-item-${tab.id}`}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                      isActive
                        ? "bg-slate-900 text-white shadow-md ring-2 ring-slate-900"
                        : "bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-white/20 text-white" : tab.bgColor}`}>
                        {tab.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs sm:text-sm truncate ${isActive ? "text-white" : "text-slate-900"}`}>
                            {tab.label}
                          </span>
                          {tab.badge && (
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                              isActive ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-700"
                            }`}>
                              {tab.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] truncate mt-0.5 ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                          {tab.shortDesc}
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick External Academic Links on Mobile */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                Doğrudan Literatür Taraması
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://scholar.google.com/scholar_labs/search?hl=tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold"
                >
                  <span>Google Scholar</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://consensus.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold"
                >
                  <span>Consensus AI</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
