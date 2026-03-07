"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Globe } from "lucide-react";

export const LANGUAGES = [
  { code: "en", label: "English",  speechCode: "en-IN" },
  { code: "as", label: "অসমীয়া", speechCode: "as-IN" },
  { code: "hi", label: "हिन्दी",   speechCode: "hi-IN" },
  { code: "bn", label: "বাংলা",    speechCode: "bn-IN" },
  { code: "te", label: "తెలుగు",   speechCode: "te-IN" },
  { code: "ta", label: "தமிழ்",    speechCode: "ta-IN" },
  { code: "mr", label: "मराठी",    speechCode: "mr-IN" },
  { code: "gu", label: "ગુજરાતી",  speechCode: "gu-IN" },
  { code: "kn", label: "ಕನ್ನಡ",    speechCode: "kn-IN" },
];

interface Props {
  selected: string;
  onChange: (code: string) => void;
}

export default function LanguageSelector({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === selected) || LANGUAGES[0];

  return (
    <div style={{ position: "relative" }}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "5px",
          background: "rgba(224,123,57,0.08)",
          border: "1px solid rgba(224,123,57,0.25)",
          borderRadius: "8px", padding: "5px 9px",
          color: "#E07B39", cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px", whiteSpace: "nowrap", flexShrink: 0,
        }}
      >
        <Globe size={12} />
        <span>{current.code.toUpperCase()}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              style={{ position: "fixed", inset: 0, zIndex: 99 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute", top: "calc(100% + 6px)",
                right: 0, zIndex: 100,
                background: "#FAFAF7",
                border: "1px solid #DDD4C4",
                borderRadius: "10px",
                overflow: "hidden", minWidth: "140px",
                boxShadow: "0 8px 32px rgba(92,45,110,0.12)",
              }}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { onChange(lang.code); setOpen(false); }}
                  style={{
                    width: "100%", textAlign: "left",
                    padding: "9px 14px",
                    background: selected === lang.code
                      ? "rgba(224,123,57,0.08)" : "transparent",
                    border: "none",
                    color: selected === lang.code ? "#E07B39" : "#4A3728",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "13px",
                    cursor: "pointer", display: "block",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(224,123,57,0.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      selected === lang.code
                        ? "rgba(224,123,57,0.08)" : "transparent")
                  }
                >
                  {lang.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
