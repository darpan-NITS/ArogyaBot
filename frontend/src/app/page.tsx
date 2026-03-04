"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Message } from "@/types/chat";
import MessageBubble from "@/components/MessageBubble";
import VoiceButton from "@/components/VoiceButton";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "bot",
  text: "Namaste 🙏 I'm ArogyaBot. Tell me what symptoms you're experiencing — you can type or speak in Hindi or English. I'll help assess your condition and find the nearest health facility.",
  timestamp: new Date(),
  severity: null,
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Add typing indicator
    const typingMsg: Message = {
      id: "typing",
      role: "bot",
      text: "",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMsg]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        }
      );
      const data = await res.json();

      // Replace typing indicator with real response
      setMessages((prev) =>
        prev
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
        prev
          .filter((m) => m.id !== "typing")
          .concat({
            id: Date.now().toString(),
            role: "bot",
            text: "Sorry, I couldn't connect to the server. Please check your connection.",
            timestamp: new Date(),
          })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "var(--bg-primary)",
      maxWidth: "760px",
      margin: "0 auto",
    }}>

      {/* ── HEADER ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
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
            fontSize: "10px", color: "#1e6050",
            letterSpacing: "1.5px",
          }}>
            AI HEALTH TRIAGE · INDIA
          </div>
        </div>

        {/* Live indicator */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
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
      </motion.header>

      {/* ── MESSAGES ── */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "24px 0",
      }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── INPUT BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {/* Voice button */}
        <VoiceButton
          onTranscript={(text) => setInput(text)}
          disabled={isLoading}
        />

        {/* Text input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Describe your symptoms... (English or Hindi)"
          disabled={isLoading}
          style={{
            flex: 1,
            background: "rgba(0,201,167,0.04)",
            border: "1px solid var(--border)",
            borderRadius: "22px",
            padding: "12px 18px",
            color: "#dde8f0",
            fontFamily: "'Outfit'",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(0,201,167,0.4)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border)"}
        />

        {/* Send button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => sendMessage(input)}
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
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          <Send size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}