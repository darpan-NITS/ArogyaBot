"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileDown, Loader2 } from "lucide-react";
import { Message } from "@/types/chat";

interface Props {
  messages:  Message[];
  sessionId: string;
  language:  string;
}

export default function DownloadReportButton({ messages, sessionId, language }: Props) {
  const [loading, setLoading] = useState(false);

  const downloadPDF = async () => {
    setLoading(true);
    try {
      const botMessages  = messages.filter((m) => m.role === "bot" && !m.isTyping);
      const userMessages = messages.filter((m) => m.role === "user");
      const lastBot      = botMessages[botMessages.length - 1];
      const lastEntities = userMessages
        .map((m) => m.entities)
        .filter(Boolean)
        .pop();

      let medicines = [];
      if (lastEntities?.symptoms?.length) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/medicines?symptoms=${lastEntities.symptoms.join(",")}`
        );
        const data = await res.json();
        medicines = data.medicines || [];
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/report/pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id:    sessionId,
            symptoms:      lastEntities?.symptoms || [],
            duration:      lastEntities?.duration || null,
            severity:      lastBot?.severity || null,
            ai_assessment: lastBot?.text || null,
            medicines:     medicines.slice(0, 6),
            language,
          }),
        }
      );

      if (!res.ok) throw new Error("PDF generation failed");

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `arogyabot_report_${sessionId.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("PDF error:", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasBotResponse = messages.some((m) => m.role === "bot" && !m.isTyping && m.id !== "welcome");
  if (!hasBotResponse) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={downloadPDF}
      disabled={loading}
      style={{
        display: "flex", alignItems: "center", gap: "7px",
        background: "rgba(92,45,110,0.07)",
        border: "1px solid rgba(92,45,110,0.20)",
        borderRadius: "8px", padding: "7px 14px",
        cursor: loading ? "wait" : "pointer",
        transition: "all 0.2s",
      }}
    >
      {loading
        ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Loader2 size={14} color="#5C2D6E" />
          </motion.div>
        : <FileDown size={14} color="#5C2D6E" />
      }
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
        color: "#5C2D6E", letterSpacing: "0.8px",
      }}>
        {loading ? "GENERATING..." : "DOWNLOAD REPORT"}
      </span>
    </motion.button>
  );
}
