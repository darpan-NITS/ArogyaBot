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

export default function ChatPage() {
  const [messages, setMessages]       = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput]             = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [sessionId, setSessionId]     = useState<string | null>(null);
  const [language, setLanguage]       = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const [medicines, setMedicines]     = useState<any[]>([]);
  const bottomRef                     = useRef<HTMLDivElement>(null);

  // Create session on first load
  useEffect(() => {
    createSession("en").then((data) => setSessionId(data.session_id));
  }, []);

  // Re-create session on language change
  const handleLanguageChange = async (code: string) => {
    setLanguage(code);
    const data = await createSession(code);
    setSessionId(data.session_id);
    setMedicines([]);
    setMessages([{
      ...WELCOME_MESSAGE,
      id: Date.now().toString(),
      timestamp: new Date(),
    }]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading || !sessionId) return;

    const userMsgId = Date.now().toString();

    const userMsg: Message = {
      id:        userMsgId,
      role:      "user",
      text:      text.trim(),
      timestamp: new Date(),
      entities:  undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Typing indicator
    setMessages((prev) => [...prev, {
      id:        "typing",
      role:      "bot",
      text:      "",
      timestamp: new Date(),
      isTyping:  true,
    }]);

    try {
      const data = await sendMessage(text.trim(), sessionId, language);

      // Fetch medicines if symptoms were extracted
      if (data.entities?.symptoms?.length > 0) {
        const medRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/medicines?symptoms=${data.entities.symptoms.join(",")}`
        );
        const medData = await medRes.json();
        setMedicines(medData.medicines || []);
      }

      setMessages((prev) =>
        // Attach entities to user message
        prev.map((m) =>
          m.id === userMsgId
            ? { ...m, entities: data.entities }
            : m
        )
        // Remove typing indicator
        .filter((m) => m.id !== "typing")
        // Add bot response
        .concat({
          id:        Date.now().toString(),
          role:      "bot",
          text:      data.reply,
          timestamp: new Date(),
          severity:  data.severity || null,
        })
      );

    } catch {
      setMessages((prev) =>
        prev.filter((m) => m.id !== "typing").concat({
          id:        Date.now().toString(),
          role:      "bot",
          text:      "Connection error. Please make sure the backend is running.",
          timestamp: new Date(),
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", background: "var(--bg-primary)",
      maxWidth: "760px", margin: "0 auto",
    }}>

      {/* ── HEADER ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          display: "flex", alignItems: "center",
          gap: "14px", flexShrink: 0,
        }}
      >
        <div style={{
          width: "40px", height: "40px", borderRadius: "12px",
          background: "rgba(0,201,167,0.1)",
          border: "1px solid rgba(0,201,167,0.25)",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "20px",
        }}>🩺</div>

        <div>
          <h1 style={{
            fontFamily: "'DM Serif Display'",
            fontSize: "20px", fontWeight: 400,
            color: "#dde8f0", letterSpacing: "-0.3px",
          }}>
            Arogya<span style={{ color: "#00c9a7", fontStyle: "italic" }}>Bot</span>
          </h1>
          <div style={{
            fontFamily: "'JetBrains Mono'",
            fontSize: "10px", color: "#1e6050", letterSpacing: "1.5px",
          }}>
            {sessionId
              ? `SESSION · ${sessionId.slice(0, 8).toUpperCase()}`
              : "INITIALIZING..."}
          </div>
        </div>

        <div style={{
          marginLeft: "auto",
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          {/* Waveform — only shows when recording */}
          <VoiceWaveform isActive={isRecording} />

          {/* Language selector */}
          <LanguageSelector selected={language} onChange={handleLanguageChange} />

          {/* Live dot */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: "6px", height: "6px",
                borderRadius: "50%", background: "#00c9a7",
              }}
            />
            <span style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: "10px", color: "#1e6050",
            }}>ONLINE</span>
          </div>
        </div>
      </motion.header>

      {/* ── MESSAGES ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 0" }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── MEDICINE SUGGESTIONS ── */}
      {medicines.length > 0 && (
        <MedicineCard medicines={medicines} />
      )}

      {/* ── FACILITIES + DOWNLOAD ROW ── */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 20px",
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
          padding: "16px 20px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          display: "flex", gap: "10px",
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
            language === "hi"
              ? "अपने लक्षण बताएं..."
              : "Describe your symptoms..."
          }
          disabled={isLoading}
          style={{
            flex: 1,
            background: "rgba(0,201,167,0.04)",
            border: "1px solid var(--border)",
            borderRadius: "22px", padding: "12px 18px",
            color: "#dde8f0", fontFamily: "'Outfit'",
            fontSize: "14px", outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(0,201,167,0.4)"}
          onBlur={(e)  => e.target.style.borderColor = "var(--border)"}
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isLoading}
          style={{
            width: "44px", height: "44px",
            borderRadius: "50%",
            background: input.trim() && !isLoading
              ? "#00c9a7"
              : "rgba(0,201,167,0.08)",
            border: "none",
            color: input.trim() && !isLoading ? "#070d0f" : "#1e4050",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
            transition: "all 0.2s", flexShrink: 0,
          }}
        >
          <Send size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}
