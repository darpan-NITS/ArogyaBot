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
          background: "rgba(91,168,160,0.08)",
          border: "1px solid rgba(91,168,160,0.2)",
          borderRadius: "8px", padding: "5px 8px",
          color: "var(--accent-teal)", cursor: "pointer",
          fontFamily: "'JetBrains Mono'", fontSize: "10px",
          whiteSpace: "nowrap",
        }}
      >
        <Globe size={12} />
        {/* Show short code on very small screens, full label otherwise */}
        <span className="lang-label">{current.label}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              style={{
                position: "fixed", inset: 0, zIndex: 99,
              }}
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
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                overflow: "hidden", minWidth: "130px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
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
                      ? "rgba(91,168,160,0.12)" : "transparent",
                    border: "none",
                    color: selected === lang.code
                      ? "var(--accent-teal)" : "var(--text-secondary)",
                    fontFamily: "'Outfit'", fontSize: "13px",
                    cursor: "pointer", display: "block",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(91,168,160,0.07)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      selected === lang.code
                        ? "rgba(91,168,160,0.12)" : "transparent")
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
