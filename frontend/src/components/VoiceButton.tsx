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
  idle:        { color: "#00c9a7", bg: "rgba(0,201,167,0.08)",   border: "rgba(0,201,167,0.3)" },
  listening:   { color: "#ff6b6b", bg: "rgba(255,107,107,0.12)", border: "#ff6b6b" },
  processing:  { color: "#ffd166", bg: "rgba(255,209,102,0.12)", border: "rgba(255,209,102,0.4)" },
  error:       { color: "#ff6b6b", bg: "rgba(255,107,107,0.08)", border: "rgba(255,107,107,0.3)" },
  unsupported: { color: "#444",    bg: "rgba(0,0,0,0.1)",        border: "#222" },
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
          background: "#0c1a1f",
          border: "1px solid rgba(0,201,167,0.3)",
          color: "#dde8f0",
          fontFamily: "Outfit",
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
          background: "#0c1a1f",
          border: "1px solid rgba(255,107,107,0.3)",
          color: "#dde8f0",
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
          width: "44px", height: "44px",
          borderRadius: "50%",
          border: `1px solid ${cfg.border}`,
          background: cfg.bg,
          color: cfg.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          flexShrink: 0, position: "relative",
          transition: "all 0.2s",
          opacity: disabled ? 0.5 : 1,
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
                    borderRadius: "50%", border: "1px solid #ff6b6b",
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
              fontFamily: "'JetBrains Mono'",
              fontSize: "9px", color: "#ff6b6b", letterSpacing: "1px",
            }}
          >
            LISTENING...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
