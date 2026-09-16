import React, { useState, useEffect, useRef } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Target,
  Plus,
  Flame,
  Award,
  Clock,
  Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";

export const ExamStudySuite: React.FC = () => {
  // Pomodoro State
  const [mode, setMode] = useState<"study" | "shortBreak" | "longBreak">("study");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Temel Matematik");
  const [completedSessions, setCompletedSessions] = useState(0);

  // Daily Question Target State
  const [dailyGoal, setDailyGoal] = useState(150);
  const [solvedQuestions, setSolvedQuestions] = useState<{ [subject: string]: number }>({
    "Türkçe / Paragraf": 40,
    "Temel Matematik": 35,
    "Fen Bilimleri": 20,
    "Sosyal / Tarih": 15,
  });

  const [newSubjectName, setNewSubjectName] = useState("İngilizce / YDT");
  const [newQuestionCount, setNewQuestionCount] = useState(20);

  // Gentle audio chime using Web Audio API
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.error(e);
    }
  };

  // Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();
      if (mode === "study") {
        setCompletedSessions((prev) => prev + 1);
        confetti({ particleCount: 30, spread: 50 });
        alert(`Tebrikler! ${selectedSubject} çalışma seansını başarıyla tamamladın. Şimdi mola vakti!`);
        switchMode("shortBreak");
      } else {
        alert("Mola bitti! Yeni odak seansına hazır mısın?");
        switchMode("study");
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, selectedSubject]);

  const switchMode = (newMode: "study" | "shortBreak" | "longBreak") => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === "study") setTimeLeft(25 * 60);
    if (newMode === "shortBreak") setTimeLeft(5 * 60);
    if (newMode === "longBreak") setTimeLeft(15 * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === "study") setTimeLeft(25 * 60);
    if (mode === "shortBreak") setTimeLeft(5 * 60);
    if (mode === "longBreak") setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalQuestionsSolved = Object.values(solvedQuestions).reduce(
    (a: number, b: number) => Number(a) + Number(b),
    0
  );
  const progressPercent = Math.min(100, Math.round((Number(totalQuestionsSolved) / dailyGoal) * 100));

  const handleAddQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName || newQuestionCount <= 0) return;
    setSolvedQuestions((prev) => ({
      ...prev,
      [newSubjectName]: (prev[newSubjectName] || 0) + Number(newQuestionCount),
    }));
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            <Timer className="w-3.5 h-3.5" />
            Sınav Çalışma Kolaylığı & Odak Atölyesi
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit']">
            Zamanı ve Çalışma Disiplinini Yönetin
          </h2>
          <p className="text-amber-50 text-sm leading-relaxed">
            Pomodoro tekniğiyle derin odaklanma seansları uygulayın, günlük soru hedeflerinizi ders bazında takip ederek sınavlara adım adım hazırlanın.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* POMODORO TIMER (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col justify-between space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Pomodoro Odak Sayacı
              </h3>
              <p className="text-xs text-slate-500">25 dk tam odaklanma + 5 dk zihin dinlendirme</p>
            </div>

            {/* Mode Selectors */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => switchMode("study")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === "study"
                    ? "bg-white text-amber-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Çalışma (25d)
              </button>
              <button
                onClick={() => switchMode("shortBreak")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === "shortBreak"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Kısa Mola (5d)
              </button>
              <button
                onClick={() => switchMode("longBreak")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === "longBreak"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Uzun Mola (15d)
              </button>
            </div>
          </div>

          {/* Subject Dropdown */}
          <div className="max-w-xs mx-auto w-full text-center space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Çalışılan Ders</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
            >
              <option value="Temel Matematik">Temel Matematik</option>
              <option value="AYT Matematik & Geometri">AYT Matematik & Geometri</option>
              <option value="Türkçe & Paragraf Taktikleri">Türkçe & Paragraf Taktikleri</option>
              <option value="Fen Bilimleri (Fizik, Kimya, Biyo)">Fen Bilimleri (Fizik, Kimya, Biyo)</option>
              <option value="YDT İngilizce & Gramer">YDT İngilizce & Gramer</option>
              <option value="Sosyal Bilimler & Felsefe">Sosyal Bilimler & Felsefe</option>
              <option value="TEKNOFEST / TÜBİTAK Rapor Yazımı">TEKNOFEST / TÜBİTAK Rapor Yazımı</option>
            </select>
          </div>

          {/* Big Circular Display */}
          <div className="text-center my-auto space-y-4">
            <div className="text-7xl sm:text-8xl font-black tracking-tighter text-slate-900 font-mono select-none">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs font-bold text-amber-700 bg-amber-50 inline-block px-3 py-1 rounded-full border border-amber-200">
              {isRunning ? "🔥 Odaklanma Devam Ediyor" : "⏸️ Sayaç Duraklatıldı"}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg transition-all cursor-pointer ${
                isRunning
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "bg-amber-600 hover:bg-amber-500 shadow-amber-600/25"
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              <span>{isRunning ? "Duraklat" : "Başlat"}</span>
            </button>

            <button
              onClick={resetTimer}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Sıfırla"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Session Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
            <span>Bugün Tamamlanan Seans: <strong>{completedSessions}</strong></span>
            <span>Toplam Odak Süresi: <strong>{completedSessions * 25} dk</strong></span>
          </div>
        </div>

        {/* QUESTION TRACKER (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Target className="w-5 h-5 text-rose-500" />
                Günlük Soru Hedefi
              </h3>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                %{progressPercent} Tamamlandı
              </span>
            </div>

            {/* Target Progress Bar */}
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Çözülen: {totalQuestionsSolved} Soru</span>
                <span>Hedef: {dailyGoal} Soru</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Subject Breakdown List */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ders Bazlı Dağılım
            </span>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {Object.entries(solvedQuestions).map(([subj, count]) => (
                <div
                  key={subj}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <span className="font-semibold text-slate-700">{subj}</span>
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {count} Soru
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Questions Form */}
          <form onSubmit={handleAddQuestions} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-indigo-600" /> Soru Ekle
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Ders adı"
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
              />
              <input
                type="number"
                min={1}
                value={newQuestionCount}
                onChange={(e) => setNewQuestionCount(Number(e.target.value))}
                placeholder="Adet"
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Listeye Ekle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
