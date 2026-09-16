import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Resilient helper with fallback models and retry on temporary high demand / 503
async function generateTextWithFallback({
  contents,
  systemInstruction,
  temperature = 0.7,
}: {
  contents: any;
  systemInstruction?: string;
  temperature?: number;
}): Promise<string> {
  const ai = getAI();
  const modelsToTry = [
    "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature,
          },
        });
        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || "");
        console.warn(`Model ${modelName} (attempt ${attempt + 1}) error:`, errMsg);

        const isTransient =
          errMsg.includes("503") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("high demand") ||
          errMsg.includes("429") ||
          errMsg.includes("RESOURCE_EXHAUSTED");

        if (isTransient) {
          // Wait briefly before retry or next model
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
          continue;
        } else {
          break;
        }
      }
    }
  }

  throw new Error(
    "Yapay zeka modelleri şu anda geçici bir yoğunluk yaşıyor. Lütfen birkaç saniye sonra tekrar deneyiniz."
  );
}

// 1. TEKNOFEST & TÜBİTAK Proje Hazırlama API
app.post("/api/gemini/project-generator", async (req, res) => {
  try {
    const {
      competitionType, // "TEKNOFEST" | "TUBITAK"
      category,        // e.g. "İnsanlık Yararına Teknoloji", "2204-A Lise", etc.
      studentLevel,    // "Ortaokul", "Lise", "Üniversite"
      projectTitle,
      problemStatement,
      targetAudience,
      proposedSolution,
      technicalKeywords,
    } = req.body;

    const ai = getAI();

    const systemPrompt = `Sen Türkiye'nin en deneyimli TEKNOFEST ve TÜBİTAK proje mentörü, jüri üyesi ve bilimsel araştırma danışmanısın.
Öğrencilerin girdiği proje fikri ve bilgilerini analiz ederek resmi yarışma şartnamelerine, jüri değerlendirme kriterlerine ve akademik standartlara %100 uygun, eksiksiz, özgün ve yüksek puan alacak bir proje raporu hazırla.

Önemli Kriterler:
- Eğer yarışma TEKNOFEST ise: TEKNOFEST Ön Değerlendirme ve Detay Raporu formatına tam uymalıdır (Proje Özeti, Problem/Gereksinim, Çözüm & Özgün/Yenilikçi Yön, Kullanılan/Kullanılacak Teknolojiler/Donanım/Yazılım, Yöntem & Mimari, Hedef Kitle/Kullanıcı, Uygulanabilirlik/Sürdürülebilirlik, İş-Zaman Takvimi, Riskler ve Alternatif Çözümler).
- Eğer yarışma TÜBİTAK ise: TÜBİTAK 2204 Araştırma Projeleri Rapor Formatına tam uymalıdır (Proje Adı, Proje Alanı ve Tematik Alanı, Proje Özeti - min 150 max 250 kelime, Projenin Amacı, Giriş ve Literatür Taraması, Yöntem ve Veri Toplama Araçları, Bulgular ve Beklenen Sonuçlar, Tartışma, Öneriler ve Kaynakça).
- Çıktı Markdown formatında yapılandırılmış başlıklar, maddeler ve net teknik açıklamalar içermelidir.
- Öğrencinin seviyesine (${studentLevel || "Lise"}) uygun ancak jüriyi etkileyecek profesyonellikte bilimsel ve teknik bir dil kullanılmalıdır.
- Ayrıca raporun en başında projenin jüri değerlendirme kriterlerindeki (Özgünlük, Yöntem, Uygulanabilirlik, Yaygın Etki) güçlü yönlerini belirten 1 paragraf mentör notu ekle.`;

    const userPrompt = `
Yarışma Türü: ${competitionType}
Kategori / Alan: ${category}
Öğrenci Kademesi: ${studentLevel}
Proje Başlığı / Çalışma Adı: ${projectTitle || "Belirtilmemiş (Lütfen uygun bir özgün başlık öner)"}
Tespit Edilen Problem: ${problemStatement}
Hedef Kitle / Yararlanıcılar: ${targetAudience || "Toplum / Belirtilen grup"}
Öğrencinin Düşündüğü Çözüm Fikri: ${proposedSolution}
Teknik Anahtar Kelimeler: ${technicalKeywords || "Yapay zeka, nesnelerin interneti, veri analizi vb."}

Lütfen bu bilgiler ışığında öğrencinin doğrudan yarışma başvurusunda kullanabileceği, detaylı, akademik ve teknik açıdan zengin resmi proje metnini üret.`;

    const reportText = await generateTextWithFallback({
      contents: userPrompt,
      systemInstruction: systemPrompt,
      temperature: 0.7,
    });

    res.json({
      success: true,
      report: reportText,
    });
  } catch (error: any) {
    console.error("Project generator error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Proje raporu oluşturulurken bir hata meydana geldi.",
    });
  }
});

// 2. Sosyal Sorumluluk ve Okul Temelli Proje Üretici
app.post("/api/gemini/social-project", async (req, res) => {
  try {
    const { topic, schoolScope, targetBeneficiaries, durationWeeks } = req.body;

    const systemPrompt = `Sen bir Sosyal Sorumluluk ve Topluma Hizmet Uygulamaları koordinatörüsün.
Öğrencilerin okullarında veya çevrelerinde uygulayabilecekleri, ölçülebilir sosyal etki yaratan projeler kurguluyorsun.
Proje Planı şu bölümleri içermelidir:
1. Proje Adı & Etkileyici Slogan
2. Projenin Amacı ve Sosyal Gerekçesi (Hangi ihtiyacı karşılıyor?)
3. Hedef Kitle ve Paydaşlar (Okul idaresi, veliler, yerel yönetim, STK'lar)
4. Hafta Hafta Eylem ve Uygulama Planı (${durationWeeks || 4} hafta)
5. Öğrenci Görev Dağılımı ve Gönüllülük Rolleri
6. Gerekli Kaynaklar ve Bütçesiz/Düşük Maliyetli Çözümler
7. Sosyal Etkiyi Ölçme Kriterleri (Anket, katılım sayısı vb.)
8. Sürdürülebilirlik (Proje okul kültürüne nasıl kazandırılır?)`;

    const prompt = `Konu/Alan: ${topic}
Okul/Çevre Kapsamı: ${schoolScope || "Okul içi ve yakın mahalle"}
Hedef Faydalanıcılar: ${targetBeneficiaries || "Akranlar, yaşlılar, özel gereksinimli bireyler veya çevre"}
Süre: ${durationWeeks || 4} Hafta
Detaylı, ilham verici ve kolayca hayata geçirilebilir bir sosyal sorumluluk proje planı hazırla.`;

    const planText = await generateTextWithFallback({
      contents: prompt,
      systemInstruction: systemPrompt,
    });

    res.json({ success: true, plan: planText });
  } catch (error: any) {
    console.error("Social project error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Geri Dönüşüm & Çevre Proje Atölyesi
app.post("/api/gemini/recycling-ideas", async (req, res) => {
  try {
    const { wasteType, context, goal } = req.body;

    const systemPrompt = `Sen Sıfır Atık ve Ekolojik İnovasyon uzmanısın.
Öğrencilerin okulda veya evde dönüştürebileceği atık malzemelerle (plastik kapaklar, atık kağıt/karton, elektronik atık, organik/kompost atık, tekstil vb.) yaratıcı, eğitici veya teknolojik dönüşüm fikirleri sun.
Format:
- 💡 3 Farklı Yaratıcı Geri Dönüşüm Fikri (1. Kolay Okul İçi Atölye, 2. Bilim/Teknoloji Entegreli Proje, 3. Sosyal/Sanatsal Farkındalık)
- 🛠️ Adım Adım Yapılış Rehberi
- 🌍 Çevresel Fayda ve Karbon Ayak İzi Tasarrufu Değerlendirmesi
- 📢 Okulda Sıfır Atık Farkındalık Kampanyası İpucu`;

    const prompt = `Atık Malzeme Türü: ${wasteType}
Uygulama Alanı: ${context || "Okul ve Sınıf"}
Öğrencinin Hedefi: ${goal || "Geri dönüşüm bilinci kazandırmak ve işlevsel bir ürün üretmek"}`;

    const ideasText = await generateTextWithFallback({
      contents: prompt,
      systemInstruction: systemPrompt,
    });

    res.json({ success: true, ideas: ideasText });
  } catch (error: any) {
    console.error("Recycling error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. İngilizce İnteraktif Diyalog & Pratik Partneri
app.post("/api/gemini/english-dialogue", async (req, res) => {
  try {
    const { messages, scenario, targetLevel } = req.body;

    const systemPrompt = `You are "LinguaMentor", a supportive, engaging native English speaking teacher & dialogue partner for ESL / foreign language students.
Context: "${scenario || "Science Project Presentation & Academic Discussion"}".
Student's Target CEFR Level: "${targetLevel || "B1-B2"}".

Your behavior:
1. Respond naturally to the student's message in English matching their CEFR level.
2. Keep the conversation lively and ask an engaging open-ended question to keep them talking.
3. At the end of your response, provide a distinct "Teacher's Tip & Vocabulary" section with:
   - 💡 [Feedback/Correction]: Gently note any grammatical or phrasing improvement if the student made a mistake (otherwise praise their natural usage).
   - 🔑 [Vocabulary/Idiom]: 2 useful vocabulary items or idioms relevant to the conversation topic with Turkish translations.

Keep your response friendly, motivating, and clear.`;

    const formattedHistory = (messages || []).map((m: any) => `${m.sender === "user" ? "Student" : "LinguaMentor"}: ${m.text}`).join("\n");

    const replyText = await generateTextWithFallback({
      contents: formattedHistory || "Student: Hello teacher! Let's start our conversation.",
      systemInstruction: systemPrompt,
    });

    res.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.error("Dialogue error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Deneme Sınavı ve Soru Analiz Koçu
app.post("/api/gemini/exam-coach", async (req, res) => {
  try {
    const { examType, scores, weakTopics, targetGoal } = req.body;

    const systemPrompt = `Sen Türkiye'deki sınav sistemlerinde (LGS, TYT, AYT, YDT, KPSS) uzmanlaşmış tecrübeli bir Rehberlik ve Sınav Koçusun.
Öğrencinin girdiği deneme sınavı netlerini, yanlış yaptığı konuları ve hedeflediği puanı inceleyerek stratejik, motive edici ve gerçekçi bir çalışma planı hazırla.
Çıktı Bölümleri:
1. 📊 Genel Net ve Başarı Durumu Değerlendirmesi
2. 🎯 En Hızlı Net Artışı Sağlayacak Kritik Konular (Piyango konular)
3. 🗓️ 7 Günlük Kişiselleştirilmiş Hızlandırma Programı (Ders ve Soru Dağılımlı)
4. 🧠 Sınav Anı Taktikleri ve Zaman Yönetimi Tavsiyeleri
5. 🌟 Koçun Motivasyon Mesajı`;

    const prompt = `
Sınav Türü: ${examType}
Deneme Netleri / Sonuçları:
${JSON.stringify(scores, null, 2)}
Öğrencinin Zorlandığı / Yanlış Yaptığı Konular: ${weakTopics || "Henüz belirtilmedi"}
Hedeflediği Okul / Net Seviyesi: ${targetGoal || "Maksimum gelişim"}

Lütfen öğrenci için derinlemesine bir deneme sonuç analizi ve aksiyon planı üret.`;

    const coachReportText = await generateTextWithFallback({
      contents: prompt,
      systemInstruction: systemPrompt,
    });

    res.json({ success: true, coachReport: coachReportText });
  } catch (error: any) {
    console.error("Exam coach error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vite middleware / Production static server
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
