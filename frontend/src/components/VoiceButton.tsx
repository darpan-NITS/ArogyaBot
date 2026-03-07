"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2, AlertCircle } from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface Props {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  language?: string;
  onRecordingChange?: (isRecording: boolean) => void;
}

const statusConfig = {
  idle:        { color: "#E07B39", bg: "rgba(224,123,57,0.08)",  border: "rgba(224,123,57,0.30)" },
  listening:   { color: "#9B1C1C", bg: "rgba(155,28,28,0.10)",   border: "#9B1C1C"               },
  processing:  { color: "#B07D2A", bg: "rgba(176,125,42,0.10)",  border: "rgba(176,125,42,0.40)" },
  error:       { color: "#9B1C1C", bg: "rgba(155,28,28,0.07)",   border: "rgba(155,28,28,0.30)"  },
  unsupported: { color: "#9A8472", bg: "rgba(154,132,114,0.08)", border: "#DDD4C4"               },
};

export default function VoiceButton({
  onTranscript,
  disabled,
  language = "en-IN",
  onRecordingChange,
}: Props) {
  const { status, errorMsg, startListening, stopListening } = useVoiceInput({
    onTranscript: (text) => {
      onTranscript(text);
      toast.success(`🎙️ "${text}"`, {
        style: {
          background: "#FAFAF7",
          border: "1px solid rgba(224,123,57,0.25)",
          color: "#1C1208",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "13px",
        },
      });
    },
    language,
    onRecordingChange,
  });

  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg, {
        style: {
          background: "#FAFAF7",
          border: "1px solid rgba(155,28,28,0.25)",
          color: "#1C1208",
        },
      });
    }
  }, [errorMsg]);

  const cfg = statusConfig[status];
  const isListening  = status === "listening";
  const isProcessing = status === "processing";

  const handleClick = () => {
    if (disabled || status === "unsupported") return;
    if (isListening) stopListening();
    else startListening();
  };

  return (
    <div style={{ position: "relative" }}>
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        title={
          status === "unsupported" ? "Use Chrome for voice input"
          : isListening ? "Click to stop"
          : "Click to speak"
        }
        style={{
          width: "42px", height: "42px",
          borderRadius: "50%",
          border: `1px solid ${cfg.border}`,
          background: cfg.bg,
          color: cfg.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          flexShrink: 0, position: "relative",
          transition: "all 0.2s",
          opacity: disabled ? 0.45 : 1,
        }}
      >
        <AnimatePresence>
          {isListening && (
            <>
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.8 + i * 0.4, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  style={{
                    position: "absolute", inset: 0,
                    borderRadius: "50%", border: "1px solid #9B1C1C",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {isProcessing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={18} />
          </motion.div>
        ) : status === "error" ? (
          <AlertCircle size={18} />
        ) : isListening ? (
          <MicOff size={18} />
        ) : (
          <Mic size={18} />
        )}
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              bottom: "-22px", left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px", color: "#9B1C1C", letterSpacing: "1px",
            }}
          >
            LISTENING...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
