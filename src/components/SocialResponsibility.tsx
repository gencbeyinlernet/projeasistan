import React, { useState } from "react";
import {
  HeartHandshake,
  Users,
  Calendar,
  Sparkles,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  Copy,
  Download,
  Share2,
  CheckSquare,
  Square,
  AlertTriangle
} from "lucide-react";

interface SocialProjectPlan {
  title: string;
  topic: string;
  planText: string;
  createdDate: string;
}

export const SocialResponsibility: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [schoolScope, setSchoolScope] = useState("Okul İçi ve Çevre Mahalle");
  const [targetBeneficiaries, setTargetBeneficiaries] = useState("");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-made inspirations
  const presetThemes = [
    {
      title: "Kardeş Köy Okuluna Bilim ve Kitap Köprüsü",
      scope: "Tüm Okul ve İlçe Genelinde",
      target: "Kırsal kesimdeki ilkokul öğrencileri",
      weeks: 4,
      desc: "Öğrencilerin kullanmadığı eğitici kitap, TÜBİTAK bilim çocuk dergisi ve deney malzemelerini toplayıp kardeş okula ulaştırması.",
    },
    {
      title: "Akran Danışmanlığı & Ders Destek Ağı",
      scope: "Okul İçi (Öğrenci Kulüpleri)",
      target: "Derslerinde desteğe ihtiyaç duyan 9. ve 10. sınıf öğrencileri",
      weeks: 6,
      desc: "Üst sınıf gönüllü öğrencilerin haftalık 2 saat sınavlara hazırlık ve ödev mentörlüğü vermesi.",
    },
    {
      title: "Kuşaklararası Dijital ve Sevgi Köprüsü",
      scope: "Yerel Huzurevi ve Emekliler Lokali",
      target: "Huzurevi sakinleri ve mahalledeki yaşlı bireyler",
      weeks: 3,
      desc: "Gençlerin büyüklere akıllı telefon, görüntülü arama ve dijital güvenlik öğretmesi; onlardan hayat tecrübeleri dinleyip anı kitabı hazırlaması.",
    },
    {
      title: "Okul Çevresi Sokak Hayvanları Barınma & Beslenme Timi",
      scope: "Okul Bahçesi ve Çevresi",
      target: "Sokak kedileri ve kuşlar",
      weeks: 4,
      desc: "Ahşap ve geri dönüştürülmüş malzemelerden soğuğa dayanıklı kedi evleri yapımı ve kantin organik atıklarının düzenli mama noktalarına ayrılması.",
    },
  ];

  const handleSelectPreset = (p: typeof presetThemes[0]) => {
    setTopic(p.title);
    setSchoolScope(p.scope);
    setTargetBeneficiaries(p.target);
    setDurationWeeks(p.weeks);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/gemini/social-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          schoolScope,
          targetBeneficiaries,
          durationWeeks,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedPlan(data.plan);
      } else {
        setErrorMessage(data.error || "Proje planı oluşturulamadı. Lütfen tekrar deneyin.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPlan) return;
    navigator.clipboard.writeText(generatedPlan);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            <HeartHandshake className="w-3.5 h-3.5" />
            Sosyal Sorumluluk & Topluma Hizmet
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit']">
            Okul ve Toplum İçin Anlamlı Değişim Başlat
          </h2>
          <p className="text-emerald-50 text-sm leading-relaxed">
            Öğrencilerin empati, liderlik ve yurttaşlık bilinci kazanacağı; okul idaresi, veliler ve akranlarla birlikte yürütebilecekleri sürdürülebilir sosyal sorumluluk projeleri tasarlayın.
          </p>
        </div>
      </div>

      {/* Preset Inspirations */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          İlham Verici Okul Temelli Proje Fikirleri (Tek Tıkla Yükle)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presetThemes.map((item, idx) => (
            <button
              key={idx}
              type="button"
              id={`preset-social-${idx}`}
              onClick={() => handleSelectPreset(item)}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-xs transition-all text-left flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {item.weeks} Hafta
                </span>
                <h4 className="font-bold text-sm text-slate-900 leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{item.desc}</p>
              </div>
              <div className="pt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span>Forma Aktar</span> &rarr;
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Generator Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Yeni Sosyal Sorumluluk Proje Planı Kurgula
            </h3>
            <p className="text-xs text-slate-500">
              Uygulanacak adımları, gönüllülük görev dağılımını ve okul izin süreçlerini yapılandırın.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Proje Konusu / Fikriniz
            </label>
            <input
              type="text"
              id="social-topic-input"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ör: Köy okullarına robotik seti ve kitap desteği, Yaşlılara dijital okuryazarlık..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Uygulama Kapsamı
              </label>
              <select
                id="social-scope-select"
                value={schoolScope}
                onChange={(e) => setSchoolScope(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Sınıf İçi & Akranlar">Sınıf İçi & Akranlar</option>
                <option value="Tüm Okul Çapında">Tüm Okul Çapında</option>
                <option value="Okul İçi ve Çevre Mahalle">Okul İçi ve Çevre Mahalle</option>
                <option value="İlçe / Şehir Genelinde">İlçe / Şehir Genelinde</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hedef Faydalanıcılar
              </label>
              <input
                type="text"
                id="social-target-input"
                value={targetBeneficiaries}
                onChange={(e) => setTargetBeneficiaries(e.target.value)}
                placeholder="Ör: Alt sınıf öğrencileri, sokak canlıları, huzurevi..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tahmini Uygulama Süresi
              </label>
              <select
                id="social-duration-select"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value={2}>2 Hafta (Hızlı Eylem)</option>
                <option value={4}>4 Hafta (1 Ay - Standart)</option>
                <option value={8}>8 Hafta (2 Ay - Kapsamlı)</option>
                <option value={16}>1 Dönem (Okul Yılı Projesi)</option>
              </select>
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

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              id="btn-generate-social-plan"
              disabled={loading || !topic}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Proje Planı Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="w-4 h-4" />
                  <span>Sosyal Proje Eylem Planını Üret</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Output */}
      {generatedPlan && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h4 className="font-bold text-base">Sosyal Sorumluluk Eylem & Uygulama Kılavuzu</h4>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
            >
              {copySuccess ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copySuccess ? "Kopyalandı" : "Kopyala"}</span>
            </button>
          </div>
          <div className="p-6 sm:p-8 whitespace-pre-wrap text-slate-800 text-sm leading-relaxed bg-slate-50/50">
            {generatedPlan}
          </div>
        </div>
      )}
    </div>
  );
};
