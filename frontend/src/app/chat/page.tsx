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
  text: "Namaste 🙏 I'm ArogyaBot. Tell me what symptoms you're experiencing — type or speak in your language. I'll help assess your condition and find the nearest health facility.",
  timestamp: new Date(),
  severity: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ChatPage() {
  const [messages, setMessages]       = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput]             = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [sessionId, setSessionId]     = useState<string | null>(null);
  const [language, setLanguage]       = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const [medicines, setMedicines]     = useState<any[]>([]);
  const [backendReady, setBackendReady] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Restore body overflow hidden (landing page sets it to auto)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }, []);

  // Wake backend + create session
  useEffect(() => {
    const init = async () => {
      // Retry up to 3 times for Render cold start
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await fetch(`${API_URL}/`);           // ← was /health (wrong)
          const data = await createSession("en");
          setSessionId(data.session_id);
          setBackendReady(true);
          return;
        } catch (err) {
          console.warn(`Init attempt ${attempt} failed:`, err);
          if (attempt < 3) await new Promise(r => setTimeout(r, 3000));
        }
      }
      setBackendReady(false);
    };
    init();
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
    } catch (err) {
      console.error("Session creation failed:", err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading || !sessionId) return;

    const userMsgId = Date.now().toString();
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
      entities: undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, {
      id: "typing",
      role: "bot",
      text: "",
      timestamp: new Date(),
      isTyping: true,
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
            id: Date.now().toString(),
            role: "bot",
            text: data.reply,
            timestamp: new Date(),
            severity: data.severity || null,
          })
      );
    } catch {
      setMessages((prev) =>
        prev.filter((m) => m.id !== "typing").concat({
          id: Date.now().toString(),
          role: "bot",
          text: "Connection error. Please try again.",
          timestamp: new Date(),
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sessionLabel = sessionId
    ? `SESSION · ${sessionId.slice(0, 8).toUpperCase()}`
    : backendReady
    ? "INITIALIZING..."
    : "CONNECTING...";

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh",
      background: "var(--bg-primary)",
      maxWidth: "760px", margin: "0 auto",
    }}>

      {/* ── HEADER ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          flexShrink: 0,
        }}
      >
        {/* Single responsive row */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          {/* Logo icon */}
          <div style={{
            width: "34px", height: "34px", borderRadius: "9px",
            background: "rgba(90,168,160,0.12)",
            border: "1px solid rgba(90,168,160,0.25)",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "16px",
            flexShrink: 0,
          }}>🩺</div>

          {/* Title + session */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontFamily: "'DM Serif Display'",
              fontSize: "17px", fontWeight: 400,
              color: "var(--text-primary)", letterSpacing: "-0.3px",
              whiteSpace: "nowrap",
            }}>
              Arogya<span style={{ color: "var(--accent-teal)", fontStyle: "italic" }}>Bot</span>
            </h1>
            <div style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: "8px", color: "var(--text-muted)",
              letterSpacing: "0.8px",
              whiteSpace: "nowrap", overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {sessionLabel}
            </div>
          </div>

          {/* Right controls */}
          <div style={{
            display: "flex", alignItems: "center",
            gap: "6px", flexShrink: 0,
          }}>
            {isRecording && <VoiceWaveform isActive={isRecording} />}
            <LanguageSelector selected={language} onChange={handleLanguageChange} />
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: "6px", height: "6px",
                borderRadius: "50%",
                background: backendReady ? "var(--accent-teal)" : "var(--accent-salmon)",
                flexShrink: 0,
              }}
            />
          </div>
        </div>
      </motion.header>

      {/* ── MESSAGES ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 0" }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {medicines.length > 0 && (
          <MedicineCard medicines={medicines} />
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── FACILITIES + DOWNLOAD ── */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-secondary)",
        flexShrink: 0,
      }}>
        <FindFacilitiesButton />
        <DownloadReportButton
          messages={messages}
          sessionId={sessionId || ""}
          language={language}
        />
      </div>

      {/* ── INPUT BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "12px 14px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          display: "flex", gap: "8px",
          alignItems: "center", flexShrink: 0,
        }}
      >
        <VoiceButton
          onTranscript={(text) => {
            setInput(text);
            setIsRecording(false);
          }}
          onRecordingChange={setIsRecording}
          disabled={isLoading}
          language={
            LANGUAGES.find((l) => l.code === language)?.speechCode || "en-IN"
          }
        />

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder={
            !sessionId
              ? "Connecting..."
              : language === "hi" ? "अपने लक्षण बताएं..."
              : language === "as" ? "আপোনাৰ লক্ষণ কওক..."
              : "Describe your symptoms..."
          }
          disabled={isLoading || !sessionId}
          style={{
            flex: 1,
            background: "rgba(90,168,160,0.05)",
            border: "1px solid var(--border)",
            borderRadius: "22px", padding: "11px 16px",
            color: "var(--text-primary)",
            fontFamily: "'Outfit'",
            fontSize: "14px", outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(90,168,160,0.4)"}
          onBlur={(e)  => e.target.style.borderColor = "var(--border)"}
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isLoading || !sessionId}
          style={{
            width: "42px", height: "42px",
            borderRadius: "50%",
            background: input.trim() && !isLoading && sessionId
              ? "var(--accent-teal)"
              : "rgba(90,168,160,0.08)",
            border: "none",
            color: input.trim() && !isLoading && sessionId
              ? "#0d1515"
              : "var(--text-muted)",
            display: "flex", alignItems: "center",
            justifyContent: "center",
            cursor: input.trim() && !isLoading && sessionId
              ? "pointer" : "not-allowed",
            transition: "all 0.2s", flexShrink: 0,
          }}
        >
          <Send size={17} />
        </motion.button>
      </motion.div>
    </div>
  );
}
