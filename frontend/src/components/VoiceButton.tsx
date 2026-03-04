"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

interface Props {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  language?: string;
}

export default function VoiceButton({ onTranscript, disabled }: Props) {
  const [isListening, setIsListening] = useState(false);

  const toggleVoice = () => {
    if (disabled) return;

    // Check browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = () => setIsListening(false);

    recognition.start();
  };

  return (
    <motion.button
      onClick={toggleVoice}
      whileTap={{ scale: 0.92 }}
      style={{
        width: "44px", height: "44px",
        borderRadius: "50%",
        border: `1px solid ${isListening ? "#ff6b6b" : "rgba(0,201,167,0.3)"}`,
        background: isListening
          ? "rgba(255,107,107,0.12)"
          : "rgba(0,201,167,0.08)",
        color: isListening ? "#ff6b6b" : "#00c9a7",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Pulse ring when listening */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              position: "absolute", inset: 0,
              borderRadius: "50%",
              border: "1px solid #ff6b6b",
            }}
          />
        )}
      </AnimatePresence>
      {isListening
        ? <MicOff size={18} />
        : <Mic size={18} />
      }
    </motion.button>
  );
}