import React, { useState } from "react";
import {
  Recycle,
  TreePine,
  Droplets,
  Zap,
  Sparkles,
  Layers,
  CheckCircle2,
  Copy,
  Lightbulb,
  Leaf,
  Flame,
  AlertTriangle
} from "lucide-react";

export const RecyclingWorkshop: React.FC = () => {
  // Eco-Calculator State
  const [paperKg, setPaperKg] = useState<number>(25);
  const [plasticKg, setPlasticKg] = useState<number>(15);
  const [metalKg, setMetalKg] = useState<number>(5);

  // Environmental Savings Math (Based on official EPA / T.C. Çevre Şehircilik Bakanlığı Sıfır Atık Verileri)
  // 1000 kg kağıt = 17 yetişkin ağaç (0.017 ağaç/kg)
  const savedTrees = (paperKg * 0.017).toFixed(1);
  // 1 kg kağıt = 28 litre su; 1 kg plastik = 25 litre su; 1 kg metal = 40 litre su
  const savedWaterLiters = Math.round(paperKg * 28 + plasticKg * 25 + metalKg * 40);
  // Engellenen CO2 (kg): 1 kg kağıt = 2.5 kg CO2; 1 kg plastik = 1.5 kg CO2; 1 kg metal = 9 kg CO2
  const savedCO2 = (paperKg * 2.5 + plasticKg * 1.5 + metalKg * 9).toFixed(1);
  // Enerji (kWh): 1 kg kağıt = 4.1 kWh; 1 kg plastik = 5.7 kWh; 1 kg metal = 14 kWh
  const savedEnergyKwh = Math.round(paperKg * 4.1 + plasticKg * 5.7 + metalKg * 14);

  // AI Recycling Generator State
  const [wasteType, setWasteType] = useState("Plastik Şişeler ve Kapaklar");
  const [context, setContext] = useState("Okul Laboratuvarı ve Sınıf");
  const [goal, setGoal] = useState("Eğitici ve teknolojik bir prototip üretmek");
  const [loading, setLoading] = useState(false);
  const [ideasResult, setIdeasResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/gemini/recycling-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wasteType, context, goal }),
      });
      const data = await res.json();
      if (data.success) {
        setIdeasResult(data.ideas);
      } else {
        setErrorMessage(data.error || "Geri dönüşüm fikirleri üretilemedi. Lütfen tekrar deneyin.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!ideasResult) return;
    navigator.clipboard.writeText(ideasResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-green-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            <Recycle className="w-3.5 h-3.5" />
            Sıfır Atık & İleri Dönüşüm (Upcycling) Atölyesi
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit']">
            Atıkları Değere, Bilime ve Geleceğe Dönüştürün
          </h2>
          <p className="text-teal-50 text-sm leading-relaxed">
            Okulunuzda toplanan atıkları hesaplayarak doğaya kazandırdığınız ağaç ve su tasarrufunu görün; atık malzemelerle bilimsel ve yaratıcı ileri dönüşüm projeleri tasarlayın.
          </p>
        </div>
      </div>

      {/* 1. ECO-CALCULATOR: OKUL ATIK VE KARBON TASARRUF SAYACI */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              Okul Sıfır Atık Etki Hesaplayıcısı
            </h3>
            <p className="text-xs text-slate-500">
              Sınıfınızın veya okulunuzun topladığı geri dönüştürülebilir atık miktarını girin, çevreye kazandırdığınız değeri anında görün.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            Canlı Etki Ölçümü
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Atık Kağıt / Karton</span>
              <span className="text-indigo-600 font-mono">{paperKg} kg</span>
            </label>
            <input
              type="range"
              min={0}
              max={500}
              step={5}
              value={paperKg}
              onChange={(e) => setPaperKg(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 block">Sınav kağıtları, defterler, kutular</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Plastik Atık & Kapak</span>
              <span className="text-emerald-600 font-mono">{plasticKg} kg</span>
            </label>
            <input
              type="range"
              min={0}
              max={300}
              step={5}
              value={plasticKg}
              onChange={(e) => setPlasticKg(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 block">Su şişeleri, yoğurt kapları, ambalaj</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Metal / Teneke İçecek Kutusu</span>
              <span className="text-amber-600 font-mono">{metalKg} kg</span>
            </label>
            <input
              type="range"
              min={0}
              max={150}
              step={2}
              value={metalKg}
              onChange={(e) => setMetalKg(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 block">Alüminyum meşrubat kutuları, konserve</span>
          </div>
        </div>

        {/* Real-time Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-950 font-['Outfit']">
                {savedTrees} Adet
              </div>
              <div className="text-xs font-semibold text-emerald-800">Kurtarılan Ağaç</div>
            </div>
          </div>

          <div className="bg-cyan-50/70 border border-cyan-200 p-4 rounded-xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-cyan-950 font-['Outfit']">
                {savedWaterLiters.toLocaleString("tr-TR")} L
              </div>
              <div className="text-xs font-semibold text-cyan-800">Tasarruf Edilen Su</div>
            </div>
          </div>

          <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-rose-950 font-['Outfit']">
                {savedCO2} kg
              </div>
              <div className="text-xs font-semibold text-rose-800">Engellenen CO₂</div>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-950 font-['Outfit']">
                {savedEnergyKwh} kWh
              </div>
              <div className="text-xs font-semibold text-amber-800">Tasarruf Edilen Enerji</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ATIKLARLA YARATICI VE BİLİMSEL İLERİ DÖNÜŞÜM ÜRETİCİ */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Yapay Zeka Geri Dönüşüm Proje Atölyesi
            </h3>
            <p className="text-xs text-slate-500">
              Elinizdeki atık malzemeyi seçin; öğrencilere uygun deney, teknolojik prototip veya okul sergisi fikirleri üretelim.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateIdeas} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Atık Malzeme Türü
              </label>
              <select
                id="waste-type-select"
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="Plastik Şişeler ve Kapaklar">Plastik Şişeler ve Kapaklar</option>
                <option value="Atık Kağıt & Karton Koli">Atık Kağıt & Karton Koli</option>
                <option value="Elektronik Atıklar (Kırık kulaklık, eski kablo, küçük motorlar)">
                  Elektronik Atıklar (E-Atık)
                </option>
                <option value="Kantin Organik & Meyve Kabuğu Atıkları">
                  Kantin Organik & Meyve Kabuğu Atıkları
                </option>
                <option value="Kullanılmayan Tekstil & Eski Giysiler">
                  Kullanılmayan Tekstil & Eski Giysiler
                </option>
                <option value="Cam Şişeler ve Kavanozlar">Cam Şişeler ve Kavanozlar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Uygulanacağı Ortam
              </label>
              <select
                id="recycling-context-select"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="Okul Laboratuvarı ve Sınıf">Okul Laboratuvarı ve Sınıf</option>
                <option value="Okul Bahçesi ve Açık Alan">Okul Bahçesi ve Açık Alan</option>
                <option value="TÜBİTAK/TEKNOFEST Prototip Atölyesi">TÜBİTAK/TEKNOFEST Prototip Atölyesi</option>
                <option value="Öğrencinin Evinde Yapabileceği">Öğrencinin Evinde Yapabileceği</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Öğrencinin Hedefi
              </label>
              <input
                type="text"
                id="recycling-goal-input"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Ör: İşlevsel bir ürün, güneş enerjili cihaz, sanat objesi..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
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
                onClick={(e) => handleGenerateIdeas(e as any)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer"
              >
                Yeniden Dene
              </button>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              id="btn-generate-recycling"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Dönüşüm Fikirleri Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <Recycle className="w-4 h-4" />
                  <span>3 Yaratıcı Geri Dönüşüm Projesi Üret</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Generated Ideas Output */}
      {ideasResult && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-400" />
              <h4 className="font-bold text-base">Geri Dönüşüm & Sıfır Atık Proje Rehberi</h4>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Kopyalandı" : "Kopyala"}</span>
            </button>
          </div>
          <div className="p-6 sm:p-8 whitespace-pre-wrap text-slate-800 text-sm leading-relaxed bg-slate-50/50 font-sans">
            {ideasResult}
          </div>
        </div>
      )}
    </div>
  );
};
