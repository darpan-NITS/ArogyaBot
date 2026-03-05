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
      // Extract data from conversation
      const botMessages  = messages.filter((m) => m.role === "bot" && !m.isTyping);
      const userMessages = messages.filter((m) => m.role === "user");
      const lastBot      = botMessages[botMessages.length - 1];
      const lastEntities = userMessages
        .map((m) => m.entities)
        .filter(Boolean)
        .pop();

      // Fetch relevant medicines
      let medicines = [];
      if (lastEntities?.symptoms?.length) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/medicines?symptoms=${lastEntities.symptoms.join(",")}`
        );
        const data = await res.json();
        medicines = data.medicines || [];
      }

      // Generate PDF
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

      // Download the PDF
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

  // Only show after at least one AI response
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
        display: "flex", alignItems: "center", gap: "8px",
        background: "rgba(59,158,255,0.08)",
        border: "1px solid rgba(59,158,255,0.25)",
        borderRadius: "8px", padding: "8px 16px",
        cursor: loading ? "wait" : "pointer",
        transition: "all 0.2s",
      }}
    >
      {loading
        ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Loader2 size={14} color="#3b9eff" />
          </motion.div>
        : <FileDown size={14} color="#3b9eff" />
      }
      <span style={{
        fontFamily: "'JetBrains Mono'", fontSize: "10px",
        color: "#3b9eff", letterSpacing: "1px",
      }}>
        {loading ? "GENERATING..." : "DOWNLOAD REPORT"}
      </span>
    </motion.button>
  );
}
