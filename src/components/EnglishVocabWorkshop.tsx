import React, { useState } from "react";
import {
  Languages,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Plus,
  Search,
  Filter,
  Layers,
  Award,
  BookOpen
} from "lucide-react";
import confetti from "canvas-confetti";
import { EnglishWord } from "../types";
import { INITIAL_WORDS } from "../data/initialData";

export const EnglishVocabWorkshop: React.FC = () => {
  const [words, setWords] = useState<EnglishWord[]>(() => {
    const saved = localStorage.getItem("ogrenci_english_words");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_WORDS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<"flashcards" | "quiz">("flashcards");

  // Quiz State
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);

  // New Word Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState({
    word: "",
    phonetic: "",
    partOfSpeech: "noun",
    meaningTr: "",
    exampleEn: "",
    exampleTr: "",
    category: "science_tech" as const,
    level: "B1-B2" as const,
  });

  // Save to localStorage
  const saveWords = (updated: EnglishWord[]) => {
    setWords(updated);
    localStorage.setItem("ogrenci_english_words", JSON.stringify(updated));
  };

  // Filtered list
  const filteredWords = words.filter((w) => {
    const matchesCat = selectedCategory === "all" || w.category === selectedCategory;
    const matchesLvl = selectedLevel === "all" || w.level === selectedLevel;
    const matchesQuery =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaningTr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesLvl && matchesQuery;
  });

  const activeWord = filteredWords[currentIndex] || filteredWords[0];

  // Pronunciation
  const speakWord = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle Learned
  const toggleLearned = (id: string) => {
    const updated = words.map((w) => (w.id === id ? { ...w, learned: !w.learned } : w));
    saveWords(updated);
    if (!activeWord?.learned) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }
  };

  // Next / Prev Card
  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % (filteredWords.length || 1));
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % (filteredWords.length || 1));
  };

  // Add Word Form
  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.word || !newWord.meaningTr) return;

    const item: EnglishWord = {
      id: "cw_" + Date.now(),
      ...newWord,
    };
    const updated = [item, ...words];
    saveWords(updated);
    setShowAddModal(false);
    setNewWord({
      word: "",
      phonetic: "",
      partOfSpeech: "noun",
      meaningTr: "",
      exampleEn: "",
      exampleTr: "",
      category: "science_tech",
      level: "B1-B2",
    });
  };

  // Quiz Options Generator
  const currentQuizOptions = React.useMemo(() => {
    if (!activeWord) return [];
    const correct = activeWord.meaningTr;
    const others = words
      .filter((w) => w.id !== activeWord.id)
      .map((w) => w.meaningTr)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [correct, ...others].sort(() => 0.5 - Math.random());
  }, [activeWord, words]);

  const handleQuizAnswer = (option: string) => {
    if (quizSelectedOption !== null) return;
    setQuizSelectedOption(option);
    const isCorrect = option === activeWord.meaningTr;
    if (isCorrect) {
      setQuizScore((prev) => prev + 10);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    }
    setTimeout(() => {
      setQuizSelectedOption(null);
      nextCard();
    }, 1400);
  };

  const learnedCount = words.filter((w) => w.learned).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            <Languages className="w-3.5 h-3.5" />
            Yabancı Dil & İngilizce Kelime Atölyesi
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit']">
            Bilim, TEKNOFEST ve Sınav İngilizcesini Fethedin
          </h2>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Akademik araştırma makaleleri, TEKNOFEST sunumları, çevre ve YDT sınavlarına özel hazırlanmış akıllı kelime kartları ve telaffuz motoru.
          </p>
        </div>
      </div>

      {/* Mode & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            id="btn-mode-flashcards"
            onClick={() => setMode("flashcards")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              mode === "flashcards"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Kart Çevirme (Flashcards)
          </button>
          <button
            id="btn-mode-quiz"
            onClick={() => setMode("quiz")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              mode === "quiz"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Hızlı Quiz Testi
          </button>
        </div>

        {/* Learning Stats & Add button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>
              Öğrenilen: <strong>{learnedCount}</strong> / {words.length} Kelime
            </span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Kelime Ekle</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Kelime veya Türkçe anlam ara..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Category */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="science_tech">🔬 Bilim & TEKNOFEST Terimleri</option>
            <option value="academic">📚 Akademik Araştırma & TÜBİTAK</option>
            <option value="environment">🌍 Çevre & Geri Dönüşüm</option>
            <option value="social">🤝 Sosyal Sorumluluk & Toplum</option>
            <option value="ydt_exam">🎯 YDT & LGS Sınav Kelimeleri</option>
          </select>
        </div>

        {/* Level */}
        <div>
          <select
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          >
            <option value="all">Tüm Seviyeler (A1 - C1)</option>
            <option value="A1-A2">A1 - A2 (Temel Seviye)</option>
            <option value="B1-B2">B1 - B2 (Orta / Lise Seviyesi)</option>
            <option value="C1">C1 (İleri Akademik)</option>
          </select>
        </div>
      </div>

      {/* Main Flashcard / Quiz Area */}
      {filteredWords.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-slate-400" />
          <p className="font-semibold text-slate-700">Aramanızla eşleşen kelime bulunamadı.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedLevel("all");
              setSearchQuery("");
            }}
            className="text-xs text-indigo-600 font-bold hover:underline"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      ) : mode === "flashcards" ? (
        /* FLASHCARD MODE */
        <div className="max-w-xl mx-auto space-y-4">
          <div
            id="flashcard-interactive-card"
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[320px] bg-white rounded-3xl p-8 border-2 border-indigo-100 shadow-xl cursor-pointer select-none transition-all duration-300 hover:border-indigo-400 flex flex-col justify-between relative group"
          >
            {/* Top Bar on Card */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                  {activeWord.level}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeWord.partOfSpeech}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakWord(activeWord.word);
                }}
                className="w-9 h-9 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors"
                title="Sesli Dinle"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Front vs Back Content */}
            {!isFlipped ? (
              <div className="my-auto text-center space-y-3 py-6">
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
                  {activeWord.word}
                </h3>
                {activeWord.phonetic && (
                  <p className="text-sm font-mono text-indigo-600/80">{activeWord.phonetic}</p>
                )}
                <p className="text-xs text-slate-400 italic pt-2">
                  (Kartı çevirip Türkçe anlamını ve örnek cümleyi görmek için tıkla)
                </p>
              </div>
            ) : (
              <div className="my-auto text-center space-y-4 py-4 animate-in fade-in zoom-in-95">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Türkçe Karşılığı
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-bold text-emerald-700 font-['Outfit']">
                    {activeWord.meaningTr}
                  </h4>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-1.5 text-xs">
                  <p className="font-medium text-slate-800 flex items-center gap-1.5">
                    <span className="text-indigo-600 font-bold">EN:</span> {activeWord.exampleEn}
                  </p>
                  <p className="text-slate-500">
                    <span className="text-emerald-600 font-bold">TR:</span> {activeWord.exampleTr}
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Card Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400">
                {currentIndex + 1} / {filteredWords.length}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLearned(activeWord.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeWord.learned
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeWord.learned ? "Öğrenildi ✓" : "Öğrendim Olarak İşaretle"}</span>
              </button>
            </div>
          </div>

          {/* Navigation Prev / Next */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              onClick={prevCard}
              className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-xs transition-colors"
            >
              &larr; Önceki Kelime
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
            >
              Çevir
            </button>
            <button
              onClick={nextCard}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-colors"
            >
              Sonraki Kelime &rarr;
            </button>
          </div>
        </div>
      ) : (
        /* QUIZ MODE */
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Kelime Bilgi Testi
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Bu Kelimenin Anlamı Nedir?
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Puan</span>
              <div className="text-xl font-black text-indigo-600 font-mono">{quizScore}</div>
            </div>
          </div>

          {/* Question Word */}
          <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h4 className="text-3xl font-extrabold text-indigo-950 font-['Outfit']">
                {activeWord.word}
              </h4>
              <button
                onClick={() => speakWord(activeWord.word)}
                className="p-2 rounded-full hover:bg-white text-indigo-600 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            {activeWord.phonetic && (
              <span className="text-xs font-mono text-indigo-500">{activeWord.phonetic}</span>
            )}
            <p className="text-xs text-slate-500 pt-1">
              Örnek: "{activeWord.exampleEn.slice(0, 75)}..."
            </p>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuizOptions.map((opt, idx) => {
              const isSelected = quizSelectedOption === opt;
              const isCorrect = opt === activeWord.meaningTr;
              let btnStyle = "bg-white border-slate-200 hover:border-indigo-400 text-slate-800";

              if (quizSelectedOption !== null) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500 text-white border-emerald-600 font-bold";
                } else if (isSelected) {
                  btnStyle = "bg-rose-500 text-white border-rose-600 font-bold";
                } else {
                  btnStyle = "bg-slate-50 text-slate-400 border-slate-200 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  id={`quiz-option-${idx}`}
                  disabled={quizSelectedOption !== null}
                  onClick={() => handleQuizAnswer(opt)}
                  className={`p-4 rounded-xl border-2 text-sm font-semibold transition-all text-left shadow-xs ${btnStyle}`}
                >
                  <span className="inline-block w-5 text-xs text-slate-400 mr-1">
                    {["A", "B", "C", "D"][idx]})
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
            <span>Soru {currentIndex + 1} / {filteredWords.length}</span>
            <button
              onClick={nextCard}
              className="text-indigo-600 font-bold hover:underline"
            >
              Soruyu Geç &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 font-['Outfit']">
                Yeni İngilizce Kelime Ekle
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddWord} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    İngilizce Kelime
                  </label>
                  <input
                    required
                    type="text"
                    value={newWord.word}
                    onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                    placeholder="Ör: Biomass"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Türkçe Anlamı
                  </label>
                  <input
                    required
                    type="text"
                    value={newWord.meaningTr}
                    onChange={(e) => setNewWord({ ...newWord, meaningTr: e.target.value })}
                    placeholder="Ör: Biyokütle"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newWord.category}
                    onChange={(e) => setNewWord({ ...newWord, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="science_tech">Bilim & Teknoloji</option>
                    <option value="academic">Akademik Araştırma</option>
                    <option value="environment">Çevre & Geri Dönüşüm</option>
                    <option value="social">Sosyal Sorumluluk</option>
                    <option value="ydt_exam">YDT & LGS Sınavı</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seviye
                  </label>
                  <select
                    value={newWord.level}
                    onChange={(e) => setNewWord({ ...newWord, level: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="A1-A2">A1-A2</option>
                    <option value="B1-B2">B1-B2</option>
                    <option value="C1">C1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Örnek İngilizce Cümle
                </label>
                <input
                  type="text"
                  value={newWord.exampleEn}
                  onChange={(e) => setNewWord({ ...newWord, exampleEn: e.target.value })}
                  placeholder="Ör: Biomass can be converted into clean biofuels."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cümlenin Türkçe Çevirisi
                </label>
                <input
                  type="text"
                  value={newWord.exampleTr}
                  onChange={(e) => setNewWord({ ...newWord, exampleTr: e.target.value })}
                  placeholder="Ör: Biyokütle temiz biyoyakıtlara dönüştürülebilir."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
                >
                  Kelimeyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
