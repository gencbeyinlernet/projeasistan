import React, { useState } from "react";
import {
  Rocket,
  Search,
  ExternalLink,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Copy,
  Download,
  Printer,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  FileText,
  Layers,
  Award,
  Clock,
  Cpu,
  AlertTriangle
} from "lucide-react";
import { TeknofestProjectInput, StudentLevel } from "../types";
import {
  TEKNOFEST_CATEGORIES,
  TUBITAK_CATEGORIES,
  SAMPLE_PROJECT_IDEAS,
} from "../data/initialData";

interface ProjectLabProps {
  studentLevel: StudentLevel;
}

export const ProjectLab: React.FC<ProjectLabProps> = ({ studentLevel }) => {
  // Academic Research Query
  const [researchQuery, setResearchQuery] = useState("");

  // Project Input Form State
  const [formData, setFormData] = useState<TeknofestProjectInput>({
    competitionType: "TEKNOFEST",
    category: TEKNOFEST_CATEGORIES[0],
    studentLevel: studentLevel,
    projectTitle: "",
    problemStatement: "",
    targetAudience: "",
    proposedSolution: "",
    technicalKeywords: "",
  });

  const [loading, setLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync studentLevel when changed from header
  React.useEffect(() => {
    setFormData((prev) => ({ ...prev, studentLevel }));
  }, [studentLevel]);

  // Handle Competition Type Change
  const handleCompetitionChange = (type: "TEKNOFEST" | "TUBITAK") => {
    setFormData((prev) => ({
      ...prev,
      competitionType: type,
      category: type === "TEKNOFEST" ? TEKNOFEST_CATEGORIES[0] : TUBITAK_CATEGORIES[0],
    }));
  };

  // Load sample project
  const loadSample = (sample: typeof SAMPLE_PROJECT_IDEAS[0]) => {
    setFormData({
      competitionType: sample.competition,
      category: sample.category,
      studentLevel: studentLevel,
      projectTitle: sample.title,
      problemStatement: sample.problem,
      targetAudience: sample.target,
      proposedSolution: sample.solution,
      technicalKeywords: sample.keywords,
    });
    setResearchQuery(sample.keywords.split(",")[0].trim() || sample.title);
  };

  // Handle Project Generation
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.problemStatement || !formData.proposedSolution) {
      setErrorMessage("Lütfen en azından tespit edilen problem ve çözüm fikri alanlarını doldurun.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/gemini/project-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Proje oluşturulamadı.");
      }

      setGeneratedReport(data.report);
      // scroll smoothly to result
      setTimeout(() => {
        document.getElementById("project-output-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Copy report
  const handleCopy = () => {
    if (!generatedReport) return;
    navigator.clipboard.writeText(generatedReport);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Download markdown
  const handleDownload = () => {
    if (!generatedReport) return;
    const blob = new Blob([generatedReport], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.competitionType}_${formData.projectTitle || "Proje_Raporu"}.md`.replace(/\s+/g, "_");
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 1. AKADEMİK LİTERATÜR ARAŞTIRMA KÖPRÜSÜ (ÖĞRETMENİN ÖZELLİKLE İSTEDİĞİ 2 SİTE) */}
      <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-60 h-60 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Search className="w-3.5 h-3.5 text-indigo-400" />
                Ön Araştırma & Literatür Taraması Merkezi
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
                Projene Başlamadan Önce Bilimsel Literatürü Keşfet
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                TÜBİTAK ve TEKNOFEST jürileri, daha önce yapılmış çalışmaları incelemiş ve literatürdeki boşluğu doğru tespit etmiş projelere en yüksek özgünlük puanını verir. Araştırma yapabileceğin iki temel akademik merkez:
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Jüri Kriteri: Literatür Hakimiyeti</span>
            </div>
          </div>

          {/* Direct Search Bar */}
          <div className="bg-white/10 backdrop-blur-md p-2 sm:p-3 rounded-2xl border border-white/15 shadow-inner">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={researchQuery}
                  onChange={(e) => setResearchQuery(e.target.value)}
                  placeholder="Araştırmak istediğin anahtar kelimeleri yaz (ör: yapay zeka geri dönüşüm, mikroplastik filtreleme)..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={
                    researchQuery.trim()
                      ? `https://scholar.google.com/scholar_labs/search?q=${encodeURIComponent(researchQuery)}&hl=tr`
                      : "https://scholar.google.com/scholar_labs/search?hl=tr"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-blue-500/25 whitespace-nowrap"
                  title="Google Scholar Labs'ta Aç"
                >
                  <span>Google Scholar Labs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={
                    researchQuery.trim()
                      ? `https://consensus.app/results/?q=${encodeURIComponent(researchQuery)}`
                      : "https://consensus.app/"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-emerald-500/25 whitespace-nowrap"
                  title="Consensus AI'da Aç"
                >
                  <span>Consensus.app (AI)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Academic Portal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Scholar Labs Card */}
            <div className="bg-slate-900/80 border border-blue-500/30 p-5 rounded-xl space-y-3 hover:border-blue-400/50 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    GS
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base">Google Scholar Labs</h3>
                    <span className="text-xs text-blue-300">scholar.google.com/scholar_labs</span>
                  </div>
                </div>
                <a
                  href="https://scholar.google.com/scholar_labs/search?hl=tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800"
                >
                  Siteye Git <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dünyanın en geniş akademik veritabanı. Hakemli makaleler, tezler, patentler ve konferans bildirilerini tarar. Projenin Türkçe ve İngilizce literatür atıflarını buradan toplayabilirsin.
              </p>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>İpucu: Yıl filtresi uygulayarak son 3 yıldaki güncel araştırmaları öne çıkar.</span>
              </div>
            </div>

            {/* Consensus AI Card */}
            <div className="bg-slate-900/80 border border-emerald-500/30 p-5 rounded-xl space-y-3 hover:border-emerald-400/50 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    CA
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base">Consensus AI Araştırma</h3>
                    <span className="text-xs text-emerald-300">consensus.app</span>
                  </div>
                </div>
                <a
                  href="https://consensus.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800"
                >
                  Siteye Git <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Yapay zeka tabanlı bilimsel arama motoru. Araştırma sorunu doğrudan yazabilirsin; 200 milyondan fazla bilimsel makaleyi tarayıp kanıtların ortak sonucunu (Consensus Meter) özetler.
              </p>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>İpucu: "Does [X] improve [Y]?" formatında araştırma sorunu doğrudan sor.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROJE HAZIRLAMA ATÖLYESİ (FORM VE SEÇENEKLER) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
        {/* Title & Quick Sample Loaders */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                TEKNOFEST & TÜBİTAK Proje Oluşturucu
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fikirlerini gir; sistem resmi jüri değerlendirme standartlarına ve rapor formatına uygun eksiksiz başvuru metnini üretsin.
            </p>
          </div>

          {/* Sample Loaders */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Hızlı Örnekler:
            </span>
            {SAMPLE_PROJECT_IDEAS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                id={`sample-project-${idx}`}
                onClick={() => loadSample(sample)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors border border-slate-200/70"
              >
                {sample.title.split(":")[0]}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Yarışma Türü Seçimi (TEKNOFEST vs TÜBİTAK) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              1. Hedef Yarışma ve Rapor Formatı
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                id="btn-competition-teknofest"
                onClick={() => handleCompetitionChange("TEKNOFEST")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.competitionType === "TEKNOFEST"
                    ? "border-rose-500 bg-rose-50/50 text-slate-900 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    TEKNOFEST Havacılık & Teknoloji
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-rose-100 text-rose-700">
                    Proje Detay Raporu
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Problem, Çözüm, Donanım/Yazılım Mimarisi, Uygulanabilirlik, İş-Zaman Takvimi ve Pazar/Yaygın Etki odaklı.
                </p>
              </button>

              <button
                type="button"
                id="btn-competition-tubitak"
                onClick={() => handleCompetitionChange("TUBITAK")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.competitionType === "TUBITAK"
                    ? "border-indigo-600 bg-indigo-50/50 text-slate-900 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                    TÜBİTAK 2204 Araştırma Projeleri
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-indigo-100 text-indigo-700">
                    Bilimsel Rapor Formatı
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Hipotez, Literatür Taraması, Yöntem & Veri Toplama, Bulgular, Tartışma ve Akademik Kaynakça odaklı.
                </p>
              </button>
            </div>
          </div>

          {/* Kategori Seçimi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Yarışma Alanı / Kategorisi
              </label>
              <select
                id="project-category-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                {(formData.competitionType === "TEKNOFEST"
                  ? TEKNOFEST_CATEGORIES
                  : TUBITAK_CATEGORIES
                ).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Öğrenci Kademesi
              </label>
              <select
                id="project-level-select"
                value={formData.studentLevel}
                onChange={(e) =>
                  setFormData({ ...formData, studentLevel: e.target.value as StudentLevel })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                <option value="Ortaokul">Ortaokul (TÜBİTAK 2204-B / TEKNOFEST Temel Seviye)</option>
                <option value="Lise">Lise (TÜBİTAK 2204-A / TEKNOFEST Lise Kategorisi)</option>
                <option value="YKS / Üniversite Hazırlık">YKS / Üniversite & Mezun Seviyesi</option>
              </select>
            </div>
          </div>

          {/* Proje Başlığı (Opsiyonel veya Öneri) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Proje Çalışma Başlığı</span>
              <span className="text-[11px] text-slate-400 font-normal">
                Boş bırakırsanız yapay zeka etkileyici bir isim önerecektir
              </span>
            </label>
            <input
              type="text"
              id="project-title-input"
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              placeholder="Örnek: EcoSort - Yapay Zeka Destekli Akıllı Okul Geri Dönüşüm Otomatı"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          {/* Problem Tanımı & Çözüm Fikri (2 Kolon) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <span>Tespit Ettiğiniz Problem / İhtiyaç</span>
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="problem-statement-textarea"
                required
                rows={4}
                value={formData.problemStatement}
                onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                placeholder="Öğrenciler veya toplum hangi zorlukla karşılaşıyor? Mevcut çözümler neden yetersiz kalıyor? Hangi eksikliği gözlemlediniz?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <span>Önerdiğiniz Çözüm Fikri & Özgün Yönü</span>
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="proposed-solution-textarea"
                required
                rows={4}
                value={formData.proposedSolution}
                onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })}
                placeholder="Nasıl bir yöntem, cihaz, yazılım veya model geliştireceksiniz? Sizin çözümünüzü diğerlerinden ayıran en yenilikçi yön nedir?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Hedef Kitle & Teknik Anahtar Kelimeler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hedef Kitle / Doğrudan Yararlanıcılar
              </label>
              <input
                type="text"
                id="target-audience-input"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="Ör: Okul öğrencileri, yaşlı bireyler, tarım üreticileri, işitme engelliler..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kullanılacak Teknolojiler / Metodoloji Kelimeleri
              </label>
              <input
                type="text"
                id="technical-keywords-input"
                value={formData.technicalKeywords}
                onChange={(e) => setFormData({ ...formData, technicalKeywords: e.target.value })}
                placeholder="Ör: Python, Arduino, YOLO nesne tanıma, Spektrometre, Anket analizi..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={(e) => handleGenerate(e as any)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer"
              >
                Yeniden Dene
              </button>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>TEKNOFEST & TÜBİTAK 2025-2026 Jüri Kılavuzlarına göre hazırlanır.</span>
            </div>

            <button
              type="submit"
              id="btn-generate-project"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Bilimsel Rapor Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>{formData.competitionType} Proje Raporunu Oluştur</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* 3. OLUŞTURULAN RAPOR ÇIKTISI ALANI */}
      {generatedReport && (
        <section id="project-output-section" className="bg-white rounded-2xl border border-slate-200/90 shadow-lg overflow-hidden">
          {/* Header Bar */}
          <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500 text-white uppercase">
                  {formData.competitionType} Resmi Rapor Çıktısı
                </span>
                <span className="text-xs text-slate-400">
                  {formData.category} | {formData.studentLevel}
                </span>
              </div>
              <h3 className="font-bold text-lg text-white font-['Outfit']">
                {formData.projectTitle || "Hazırlanan Bilimsel ve Teknik Proje Metni"}
              </h3>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-copy-report"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                title="Panoya Kopyala"
              >
                {copySuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copySuccess ? "Kopyalandı!" : "Kopyala"}</span>
              </button>

              <button
                type="button"
                id="btn-download-report"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-xs"
                title="Markdown İndir"
              >
                <Download className="w-4 h-4" />
                <span>İndir (.md)</span>
              </button>

              <button
                type="button"
                id="btn-print-report"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                title="Yazdır / PDF Olarak Kaydet"
              >
                <Printer className="w-4 h-4" />
                <span>Yazdır / PDF</span>
              </button>
            </div>
          </div>

          {/* Jüri Puanlama Kriterleri Hatırlatıcı Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="font-medium text-slate-700">Özgün Değer (25p)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="font-medium text-slate-700">Yöntem & Bilimsellik (25p)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-700">Uygulanabilirlik (25p)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="font-medium text-slate-700">Yaygın Etki & Sonuç (25p)</span>
            </div>
          </div>

          {/* Rapor İçeriği */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="prose max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-50/50 p-6 rounded-xl border border-slate-200/60 selection:bg-rose-100">
              {generatedReport}
            </div>

            {/* Next Steps Guide */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                Öğrenci ve Danışman Öğretmen İçin Sıradaki Adımlar:
              </h4>
              <ul className="text-xs text-indigo-800 space-y-1 list-disc pl-5">
                <li>Google Scholar Labs ve Consensus.app üzerinden raporda belirtilen anahtar terimlerle ilgili en az 3 akademik makale indirip kaynakçaya ekleyin.</li>
                <li>Prototip geliştirme aşamasında malzeme listesini okul laboratuvarı veya atölye imkanlarıyla teyit edin.</li>
                <li>Raporu indirerek okul danışman öğretmeninizle birlikte resmi başvuru portalına (KYS veya TÜBİTAK BİDEB) aktarın.</li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
