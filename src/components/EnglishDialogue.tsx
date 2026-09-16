import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquareQuote,
  Send,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  RefreshCw,
  BookOpen,
  Bot,
  User,
  GraduationCap
} from "lucide-react";
import { DialogueMessage } from "../types";

export const EnglishDialogue: React.FC = () => {
  const [scenario, setScenario] = useState("TEKNOFEST Science Project Presentation to International Jury");
  const [targetLevel, setTargetLevel] = useState("B1-B2");
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [messages, setMessages] = useState<DialogueMessage[]>([
    {
      id: "m1",
      sender: "bot",
      text: "Hello there! I am your AI English speaking coach. Welcome to the TEKNOFEST International Jury presentation simulation. Could you please introduce yourself and tell me what exciting problem your project aims to solve?",
      timestamp: "Şimdi",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Text-to-speech for bot messages
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // Remove emojis or special symbols for cleaner voice
      const clean = text.replace(/[*#]/g, "");
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech Recognition (Mic)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tarayıcınız ses tanıma özelliğini desteklemiyor. Lütfen metin olarak yazınız.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? prev + " " + transcript : transcript));
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  // Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMsg: DialogueMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/english-dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory,
          scenario,
          targetLevel,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const botMsg: DialogueMessage = {
          id: "b_" + Date.now(),
          sender: "bot",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorBotMsg: DialogueMessage = {
          id: "err_" + Date.now(),
          sender: "bot",
          text: `⚠️ ${data.error || "I'm temporarily experiencing high demand. Please click send again to retry!"}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorBotMsg]);
      }
    } catch (err: any) {
      console.error(err);
      const errorBotMsg: DialogueMessage = {
        id: "err_" + Date.now(),
        sender: "bot",
        text: "⚠️ Connection interrupted. Please check your connection and send your message again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "m_reset",
        sender: "bot",
        text: `Hi! We're starting a new conversation on "${scenario}". I'm ready whenever you are! What would you like to share first?`,
        timestamp: "Yeni",
      },
    ]);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            İnteraktif İngilizce Konuşma & Diyalog Partneri
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit']">
            Yapay Zeka ile Birebir İngilizce Konuşma Pratiği
          </h2>
          <p className="text-violet-100 text-sm leading-relaxed">
            TEKNOFEST jüri sunumu, geri dönüşüm tartışması veya sınav mülakatı senaryoları üzerinde konuşun; dilbilgisi düzeltmeleri ve zengin kelime önerileri alın.
          </p>
        </div>
      </div>

      {/* Scenario & Level Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Konuşma Senaryosu
          </label>
          <select
            id="dialogue-scenario-select"
            value={scenario}
            onChange={(e) => {
              setScenario(e.target.value);
              handleResetChat();
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
          >
            <option value="TEKNOFEST Science Project Presentation to International Jury">
              🚀 TEKNOFEST Projesini Uluslararası Jüriye Sunma
            </option>
            <option value="Zero Waste & Climate Action Debate">
              ♻️ Sıfır Atık & İklim Eylemi Tartışması
            </option>
            <option value="High School Life, Exams & Social Responsibility">
              🏫 Okul Hayatı, Sınavlar ve Sosyal Projeler
            </option>
            <option value="Academic Exchange & University Scholarship Interview">
              🎓 Akademik Burs ve Mülakat Simülasyonu
            </option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Hedef Seviye (CEFR)
          </label>
          <select
            id="dialogue-level-select"
            value={targetLevel}
            onChange={(e) => setTargetLevel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
          >
            <option value="A2 (Elementary)">A2 (Temel - Kısa ve anlaşılır cümleler)</option>
            <option value="B1-B2 (Intermediate / High School)">
              B1-B2 (Orta Düzey - Akıcı lise seviyesi)
            </option>
            <option value="C1 (Advanced Academic)">
              C1 (İleri Düzey - Akademik ve zengin kelimeler)
            </option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleResetChat}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Diyaloğu Baştan Başlat</span>
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg overflow-hidden flex flex-col h-[560px]">
        {/* Chat Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm">LinguaMentor (Yapay Zeka İngilizce Koçu)</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Aktif Konuşma Partneri | {targetLevel}
              </div>
            </div>
          </div>
          <span className="text-xs text-slate-400 hidden sm:block">
            Mesajları dinlemek için hoparlör ikonuna basabilirsiniz
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/60">
          {messages.map((m) => {
            const isBot = m.sender === "bot";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isBot ? "" : "ml-auto flex-row-reverse"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isBot ? "bg-violet-600 text-white" : "bg-slate-800 text-white"
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="space-y-1 max-w-xl">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isBot
                        ? "bg-white border border-slate-200 text-slate-800 rounded-tl-xs"
                        : "bg-indigo-600 text-white rounded-tr-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                      isBot ? "" : "justify-end"
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => speakText(m.text)}
                        className="hover:text-indigo-600 text-slate-400 flex items-center gap-1 font-medium"
                        title="İngilizce Dinle"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dinle</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-xs flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]" />
                <span>LinguaMentor yanıt hazırlıyor...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl transition-colors ${
              isRecording
                ? "bg-rose-500 text-white animate-pulse"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
            title={isRecording ? "Mikrofonu Kapat" : "İngilizce Sesli Konuş"}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            id="dialogue-chat-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="İngilizce yanıtınızı yazın... (Ör: Our project uses an ultrasonic sensor to...)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
          />

          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-violet-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            <span>Gönder</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
