"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Globe } from "lucide-react";

export const LANGUAGES = [
  { code: "en",    label: "English",    speechCode: "en-IN" },
  { code: "as", label: "অসমীয়া",    speechCode: "as-IN" },
  { code: "hi",    label: "हिन्दी",       speechCode: "hi-IN" },
  { code: "bn",    label: "বাংলা",        speechCode: "bn-IN" },
  { code: "te",    label: "తెలుగు",       speechCode: "te-IN" },
  { code: "ta",    label: "தமிழ்",        speechCode: "ta-IN" },
  { code: "mr",    label: "मराठी",        speechCode: "mr-IN" },
  { code: "gu",    label: "ગુજરાતી",      speechCode: "gu-IN" },
  { code: "kn",    label: "ಕನ್ನಡ",        speechCode: "kn-IN" },
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
          display: "flex", alignItems: "center", gap: "6px",
          background: "rgba(0,201,167,0.06)",
          border: "1px solid rgba(0,201,167,0.2)",
          borderRadius: "8px", padding: "6px 12px",
          color: "#00c9a7", cursor: "pointer",
          fontFamily: "'JetBrains Mono'", fontSize: "11px",
        }}
      >
        <Globe size={13} />
        {current.label}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute", top: "calc(100% + 8px)",
              right: 0, zIndex: 100,
              background: "#0c1a1f",
              border: "1px solid #0e2530",
              borderRadius: "10px",
              overflow: "hidden", minWidth: "140px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { onChange(lang.code); setOpen(false); }}
                style={{
                  width: "100%", textAlign: "left",
                  padding: "10px 16px",
                  background: selected === lang.code
                    ? "rgba(0,201,167,0.1)" : "transparent",
                  border: "none",
                  color: selected === lang.code ? "#00c9a7" : "#4a7a8a",
                  fontFamily: "'Outfit'", fontSize: "13px",
                  cursor: "pointer", display: "block",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(0,201,167,0.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    selected === lang.code
                      ? "rgba(0,201,167,0.1)" : "transparent")
                }
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
