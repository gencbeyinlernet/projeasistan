import React, { useState } from "react";
import {
  TrendingUp,
  Award,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Copy,
  BarChart3,
  BookOpen,
  ArrowUpRight,
  Target
} from "lucide-react";
import confetti from "canvas-confetti";
import { ExamScoreRecord } from "../types";
import { INITIAL_EXAM_RECORDS } from "../data/initialData";

export const ExamScoreAnalysis: React.FC = () => {
  const [records, setRecords] = useState<ExamScoreRecord[]>(() => {
    const saved = localStorage.getItem("ogrenci_exam_records");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_EXAM_RECORDS;
  });

  const [selectedExamType, setSelectedExamType] = useState<"TYT" | "AYT" | "LGS" | "YDT">("TYT");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState(new Date().toISOString().split("T")[0]);
  const [weakTopics, setWeakTopics] = useState("");
  const [targetGoal, setTargetGoal] = useState("");

  // Default subjects based on exam type
  const getInitialSubjects = (type: "TYT" | "AYT" | "LGS" | "YDT") => {
    if (type === "TYT") {
      return [
        { name: "Türkçe (40)", correct: 30, incorrect: 6, net: 28.5 },
        { name: "Sosyal Bilimler (20)", correct: 14, incorrect: 4, net: 13.0 },
        { name: "Temel Matematik (40)", correct: 25, incorrect: 5, net: 23.75 },
        { name: "Fen Bilimleri (20)", correct: 12, incorrect: 4, net: 11.0 },
      ];
    }
    if (type === "LGS") {
      return [
        { name: "Türkçe (20)", correct: 17, incorrect: 2, net: 16.33 },
        { name: "Matematik (20)", correct: 13, incorrect: 4, net: 11.67 },
        { name: "Fen Bilimleri (20)", correct: 16, incorrect: 3, net: 15.0 },
        { name: "İnkılap Tarihi (10)", correct: 9, incorrect: 1, net: 8.67 },
        { name: "Din Kültürü (10)", correct: 9, incorrect: 1, net: 8.67 },
        { name: "Yabancı Dil İngilizce (10)", correct: 9, incorrect: 1, net: 8.67 },
      ];
    }
    if (type === "YDT") {
      return [
        { name: "Kelime & Dilbilgisi (20)", correct: 16, incorrect: 3, net: 15.25 },
        { name: "Cümle Tamamlama & Çeviri (20)", correct: 17, incorrect: 2, net: 16.5 },
        { name: "Paragraf Okuma (20)", correct: 15, incorrect: 4, net: 14.0 },
        { name: "Diyalog & Anlam Bütünlüğü (20)", correct: 16, incorrect: 2, net: 15.5 },
      ];
    }
    // AYT (Sayısal default)
    return [
      { name: "Matematik (40)", correct: 28, incorrect: 4, net: 27.0 },
      { name: "Fizik (14)", correct: 9, incorrect: 3, net: 8.25 },
      { name: "Kimya (13)", correct: 10, incorrect: 2, net: 9.5 },
      { name: "Biyoloji (13)", correct: 10, incorrect: 2, net: 9.5 },
    ];
  };

  const [formSubjects, setFormSubjects] = useState(getInitialSubjects(selectedExamType));

  // Switch form subjects when exam type changes
  const handleTypeChange = (type: "TYT" | "AYT" | "LGS" | "YDT") => {
    setSelectedExamType(type);
    setFormSubjects(getInitialSubjects(type));
  };

  // Recalculate net on change
  const handleSubjectScoreChange = (
    index: number,
    field: "correct" | "incorrect",
    val: number
  ) => {
    const penalty = selectedExamType === "LGS" ? 3 : 4;
    setFormSubjects((prev) => {
      const copy = [...prev];
      const current = { ...copy[index], [field]: val };
      const net = Math.max(0, current.correct - current.incorrect / penalty);
      current.net = parseFloat(net.toFixed(2));
      copy[index] = current;
      return copy;
    });
  };

  const totalCalculatedNet = formSubjects
    .reduce((sum, s) => sum + s.net, 0)
    .toFixed(2);

  // Save new exam record
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ExamScoreRecord = {
      id: "rec_" + Date.now(),
      date: examDate,
      examName: examName || `${selectedExamType} Deneme Sınavı`,
      examType: selectedExamType,
      subjects: formSubjects,
      totalNet: parseFloat(totalCalculatedNet),
      weakTopics: weakTopics || "Belirtilmedi",
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem("ogrenci_exam_records", JSON.stringify(updated));
    setShowAddForm(false);
    setExamName("");
    setWeakTopics("");
    confetti({ particleCount: 35, spread: 60 });
  };

  // AI Exam Coach State
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachReport, setCoachReport] = useState<string | null>(null);
  const [coachError, setCoachError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleRunCoach = async () => {
    setCoachLoading(true);
    setCoachError(null);
    try {
      const latest = records[0] || {
        examType: selectedExamType,
        subjects: formSubjects,
        totalNet: parseFloat(totalCalculatedNet),
        weakTopics,
      };

      const res = await fetch("/api/gemini/exam-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examType: latest.examType,
          scores: latest.subjects,
          weakTopics: latest.weakTopics || weakTopics,
          targetGoal: targetGoal || "İlk 10.000 / Fen Lisesi Başarısı",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCoachReport(data.coachReport);
      } else {
        setCoachError(data.error || "Sınav analizi üretilemedi. Lütfen tekrar deneyin.");
      }
    } catch (err: any) {
      console.error(err);
      setCoachError(err?.message || "Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setCoachLoading(false);
    }
  };

  // Filter records by selected exam type for chart
  const filteredRecords = records
    .filter((r) => r.examType === selectedExamType)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-10 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            Deneme Sınavı Net & Konu Analiz Sistemi
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit']">
            Netlerinizi Kaydedin, Eksikleri Nokta Atışı Tespit Edin
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            TYT, AYT, LGS ve YDT deneme sınavı netlerinizi ders bazında analiz edin; yapay zeka rehberlik koçundan 7 günlük kişisel net artırma programı alın.
          </p>
        </div>
      </div>

      {/* Exam Type Selector & Add Record Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {(["TYT", "AYT", "LGS", "YDT"] as const).map((type) => (
            <button
              key={type}
              id={`exam-filter-${type.toLowerCase()}`}
              onClick={() => handleTypeChange(type)}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                selectedExamType === type
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {type} Denemeleri
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "Formu Kapat" : "Yeni Deneme Sonucu Ekle"}</span>
        </button>
      </div>

      {/* Add Record Form */}
      {showAddForm && (
        <form
          onSubmit={handleSaveRecord}
          className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-indigo-100 shadow-md space-y-6 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              {selectedExamType} Deneme Sınavı Netlerini Gir
            </h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Toplam: {totalCalculatedNet} Net
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deneme Adı / Yayın
              </label>
              <input
                type="text"
                required
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Ör: Özdebir TYT Deneme 3, Hız Yayınları LGS..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Uygulanma Tarihi
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Subjects Table */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Ders Bazlı Sonuçlar</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formSubjects.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <span className="font-semibold text-xs text-slate-800 w-36 truncate">
                    {sub.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                      <span className="text-[10px] text-emerald-700 font-bold block">Doğru</span>
                      <input
                        type="number"
                        min={0}
                        max={80}
                        value={sub.correct}
                        onChange={(e) =>
                          handleSubjectScoreChange(idx, "correct", Number(e.target.value))
                        }
                        className="w-14 px-1.5 py-1 text-center bg-white border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-rose-700 font-bold block">Yanlış</span>
                      <input
                        type="number"
                        min={0}
                        max={80}
                        value={sub.incorrect}
                        onChange={(e) =>
                          handleSubjectScoreChange(idx, "incorrect", Number(e.target.value))
                        }
                        className="w-14 px-1.5 py-1 text-center bg-white border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div className="text-center pl-2">
                      <span className="text-[10px] text-indigo-700 font-bold block">Net</span>
                      <span className="inline-block px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg text-xs font-bold font-mono">
                        {sub.net}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Topics */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bu Denemede Yanlış Yaptığınız / Boş Bıraktığınız Konular
            </label>
            <input
              type="text"
              value={weakTopics}
              onChange={(e) => setWeakTopics(e.target.value)}
              placeholder="Ör: Problemler, Paragrafta ana düşünce, Optik kırılma, Kalıtım soy ağacı..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
            >
              Denemeyi Kaydet
            </button>
          </div>
        </form>
      )}

      {/* Visual Progress & Chart */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              {selectedExamType} Net Gelişim Trendi
            </h3>
            <p className="text-xs text-slate-500">
              Girdiğiniz denemeler arasındaki net yükseliş grafiği
            </p>
          </div>

          {/* Run AI Exam Coach Button */}
          <button
            onClick={handleRunCoach}
            disabled={coachLoading || records.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {coachLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analiz Çıkarılıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Yapay Zeka Sınav Koçundan 7 Günlük Plan İste</span>
              </>
            )}
          </button>
        </div>

        {coachError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{coachError}</span>
            </div>
            <button
              type="button"
              onClick={handleRunCoach}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer"
            >
              Yeniden Dene
            </button>
          </div>
        )}

        {/* Trend Visualization (Clean SVG) */}
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Bu sınav türünde henüz kayıt bulunmuyor. Yukarıdaki "Yeni Deneme Sonucu Ekle" butonuyla ilk denemenizi kaydedin.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-44 w-full flex items-end gap-4 pt-8 pb-4 px-4 bg-slate-50 rounded-2xl border border-slate-100 relative">
              {filteredRecords.map((rec, idx) => {
                const maxNet = selectedExamType === "TYT" ? 120 : selectedExamType === "LGS" ? 90 : 80;
                const heightPercent = Math.min(100, Math.max(10, Math.round((rec.totalNet / maxNet) * 100)));
                return (
                  <div key={rec.id} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[11px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded shadow-xs border border-slate-200">
                      {rec.totalNet}
                    </span>
                    <div
                      className="w-full max-w-[48px] bg-gradient-to-t from-indigo-600 to-blue-500 rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-slate-500 truncate max-w-[70px] text-center">
                      {rec.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* List of Recent Exams */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Kayıtlı Denemeler
              </span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {filteredRecords.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/80 transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-800 text-sm">{r.examName}</span>
                      <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3 h-3" /> {r.date}
                        {r.weakTopics && (
                          <span className="text-rose-600 font-medium">
                            • Eksik: {r.weakTopics}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Toplam Net</span>
                        <span className="font-bold font-mono text-indigo-700 text-sm">
                          {r.totalNet}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Exam Coach Report */}
      {coachReport && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden animate-in fade-in">
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <h4 className="font-bold text-base">Rehberlik & Yapay Zeka Sınav Koçu Raporu</h4>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(coachReport);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
            >
              {copySuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copySuccess ? "Kopyalandı" : "Kopyala"}</span>
            </button>
          </div>
          <div className="p-6 sm:p-8 whitespace-pre-wrap text-slate-800 text-sm leading-relaxed bg-slate-50/50 font-sans">
            {coachReport}
          </div>
        </div>
      )}
    </div>
  );
};
