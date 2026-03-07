"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Message } from "@/types/chat";
import MessageBubble from "@/components/MessageBubble";
import VoiceButton from "@/components/VoiceButton";
import VoiceWaveform from "@/components/VoiceWaveform";
import LanguageSelector, { LANGUAGES } from "@/components/LanguageSelector";
import FindFacilitiesButton from "@/components/FindFacilitiesButton";
import MedicineCard from "@/components/MedicineCard";
import DownloadReportButton from "@/components/DownloadReportButton";
import { sendMessage, createSession } from "@/lib/api";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "bot",
  text: "Namaste 🙏 I'm ArogyaBot, an AI health assistant built by Darpan.Tell me what symptoms you're experiencing — type or speak in your language. I'll help assess your condition and find the nearest health facility.",
  timestamp: new Date(),
  severity: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function initWithRetry(
  setSessionId: (id: string) => void,
  setStatus: (s: string) => void
) {
  const maxAttempts = 20;
  const delay = 8000;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const data = await createSession("en");
      setSessionId(data.session_id);
      setStatus("READY");
      return;
    } catch {
      const secs = Math.round(((maxAttempts - i) * delay) / 1000);
      setStatus(`WAKING UP... ~${secs}s`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  setStatus("OFFLINE");
}

export default function ChatPage() {
  const [messages, setMessages]       = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput]             = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [sessionId, setSessionId]     = useState<string | null>(null);
  const [language, setLanguage]       = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const [medicines, setMedicines]     = useState<any[]>([]);
  const [status, setStatus]           = useState("CONNECTING...");
  const bottomRef                     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initWithRetry(setSessionId, setStatus);
  }, []);

  const handleLanguageChange = async (code: string) => {
    setLanguage(code);
    try {
      const data = await createSession(code);
      setSessionId(data.session_id);
      setMedicines([]);
      setMessages([{
        ...WELCOME_MESSAGE,
        id: Date.now().toString(),
        timestamp: new Date(),
      }]);
    } catch {
      console.error("Language switch failed");
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading || !sessionId) return;

    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, {
      id: userMsgId, role: "user",
      text: text.trim(), timestamp: new Date(),
      entities: undefined,
    }]);
    setInput("");
    setIsLoading(true);
    setMessages((prev) => [...prev, {
      id: "typing", role: "bot",
      text: "", timestamp: new Date(), isTyping: true,
    }]);

    try {
      const data = await sendMessage(text.trim(), sessionId, language);

      if (data.entities?.symptoms?.length > 0) {
        const medRes = await fetch(
          `${API_URL}/api/medicines?symptoms=${data.entities.symptoms.join(",")}`
        );
        const medData = await medRes.json();
        setMedicines(medData.medicines || []);
      }

      setMessages((prev) =>
        prev
          .map((m) => m.id === userMsgId ? { ...m, entities: data.entities } : m)
          .filter((m) => m.id !== "typing")
          .concat({
            id: Date.now().toString(), role: "bot",
            text: data.reply, timestamp: new Date(),
            severity: data.severity || null,
          })
      );
    } catch {
      setMessages((prev) =>
        prev.filter((m) => m.id !== "typing").concat({
          id: Date.now().toString(), role: "bot",
          text: "Connection error. Please try again.",
          timestamp: new Date(),
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const dotColor = sessionId ? "#2D7A4F"
    : status === "OFFLINE"   ? "#9B1C1C"
    : "#B07D2A";

  const headerLabel = sessionId
    ? `SESSION · ${sessionId.slice(0, 8).toUpperCase()}`
    : status;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html, body { height: 100%; overflow: hidden; margin: 0; padding: 0; background: #FAFAF7; }
        #chat-root { height: 100dvh; }
        @media (max-width: 480px) {
          .header-title   { font-size: 15px !important; }
          .header-session { font-size: 8px !important; letter-spacing: 0.5px !important; }
          .bottom-row     { padding: 6px 10px !important; }
          .input-bar      { padding: 10px !important; gap: 6px !important; }
        }
      `}</style>

      <div
        id="chat-root"
        style={{
          display: "flex", flexDirection: "column",
          height: "100dvh",
          background: "#FAFAF7",
          maxWidth: "760px", margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* ── HEADER ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "10px 14px",
            borderBottom: "1px solid #DDD4C4",
            background: "#F2EDE6",
            flexShrink: 0,
            boxShadow: "0 1px 8px rgba(92,45,110,0.05)",
          }}
        >
          <div style={{
            display: "flex", alignItems: "center",
            gap: "10px", width: "100%", minWidth: 0,
          }}>
            {/* Logo */}
            <div style={{
              width: "34px", height: "34px",
              borderRadius: "10px", flexShrink: 0,
              background: "rgba(224,123,57,0.12)",
              border: "1px solid rgba(224,123,57,0.28)",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "17px",
            }}>🩺</div>

            {/* Title + session */}
            <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
              <h1
                className="header-title"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "18px", fontWeight: 600,
                  color: "#1C1208", letterSpacing: "-0.3px",
                  margin: 0, whiteSpace: "nowrap",
                  overflow: "hidden", textOverflow: "ellipsis",
                }}
              >
                Arogya<span style={{ color: "#E07B39", fontStyle: "italic" }}>Bot</span>
              </h1>
              <div
                className="header-session"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "8px", color: "#9A8472",
                  letterSpacing: "0.8px",
                  whiteSpace: "nowrap", overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {headerLabel}
              </div>
            </div>

            {/* Right controls */}
            <div style={{
              display: "flex", alignItems: "center",
              gap: "8px", flexShrink: 0,
            }}>
              {isRecording && <VoiceWaveform isActive={isRecording} />}
              <LanguageSelector selected={language} onChange={handleLanguageChange} />
              <motion.div
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: "7px", height: "7px",
                  borderRadius: "50%",
                  background: dotColor,
                  flexShrink: 0,
                  transition: "background 0.5s",
                }}
              />
            </div>
          </div>
        </motion.header>

        {/* ── WAKE UP BANNER ── */}
        {!sessionId && status !== "OFFLINE" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              padding: "7px 16px",
              background: "rgba(176,125,42,0.07)",
              borderBottom: "1px solid rgba(176,125,42,0.18)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px", color: "#B07D2A",
              letterSpacing: "0.5px",
              textAlign: "center", flexShrink: 0,
            }}
          >
            ⏳ Waking up server — first load takes ~30–60 seconds...
          </motion.div>
        )}

        {/* ── OFFLINE BANNER ── */}
        {status === "OFFLINE" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              padding: "7px 16px",
              background: "rgba(155,28,28,0.06)",
              borderBottom: "1px solid rgba(155,28,28,0.15)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px", color: "#9B1C1C",
              textAlign: "center", flexShrink: 0,
            }}
          >
            ❌ Server is offline — please refresh the page
          </motion.div>
        )}

        {/* ── MESSAGES ── */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "16px 0",
          WebkitOverflowScrolling: "touch",
          background: "#FAFAF7",
        }}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {medicines.length > 0 && (
            <MedicineCard medicines={medicines} />
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── FACILITIES + DOWNLOAD ── */}
        <div
          className="bottom-row"
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 14px",
            borderTop: "1px solid #DDD4C4",
            background: "#F2EDE6",
            flexShrink: 0, gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <FindFacilitiesButton />
          <DownloadReportButton
            messages={messages}
            sessionId={sessionId || ""}
            language={language}
          />
        </div>

        {/* ── INPUT BAR ── */}
        <motion.div
          className="input-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "12px 14px",
            borderTop: "1px solid #DDD4C4",
            background: "#F2EDE6",
            display: "flex", gap: "8px",
            alignItems: "center", flexShrink: 0,
          }}
        >
          <VoiceButton
            onTranscript={(text) => { setInput(text); setIsRecording(false); }}
            onRecordingChange={setIsRecording}
            disabled={isLoading || !sessionId}
            language={LANGUAGES.find((l) => l.code === language)?.speechCode || "en-IN"}
          />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder={
              !sessionId          ? "Waiting for server..."
              : language === "hi" ? "अपने लक्षण बताएं..."
              : language === "as" ? "আপোনাৰ লক্ষণ কওক..."
              : "Describe your symptoms..."
            }
            disabled={isLoading || !sessionId}
            style={{
              flex: 1, minWidth: 0,
              background: "#FAFAF7",
              border: "1.5px solid #DDD4C4",
              borderRadius: "24px", padding: "11px 16px",
              color: "#1C1208",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "14px", outline: "none",
              transition: "border-color 0.2s",
              opacity: !sessionId ? 0.5 : 1,
            }}
            onFocus={(e) => e.target.style.borderColor = "#E07B39"}
            onBlur={(e)  => e.target.style.borderColor = "#DDD4C4"}
          />

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading || !sessionId}
            style={{
              width: "42px", height: "42px",
              borderRadius: "50%", flexShrink: 0,
              background: input.trim() && !isLoading && sessionId
                ? "#E07B39" : "#EAE2D8",
              border: "none",
              color: input.trim() && !isLoading && sessionId
                ? "#FAFAF7" : "#9A8472",
              display: "flex", alignItems: "center",
              justifyContent: "center",
              cursor: input.trim() && !isLoading && sessionId
                ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: input.trim() && !isLoading && sessionId
                ? "0 2px 12px rgba(224,123,57,0.3)" : "none",
            }}
          >
            <Send size={17} />
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
