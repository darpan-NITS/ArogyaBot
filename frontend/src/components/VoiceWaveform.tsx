"use client";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isActive: boolean;
}

export default function VoiceWaveform({ isActive }: Props) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            display: "flex", alignItems: "center",
            gap: "3px", padding: "6px 12px",
            background: "rgba(155,28,28,0.07)",
            border: "1px solid rgba(155,28,28,0.20)",
            borderRadius: "20px",
          }}
        >
          {[0.4, 0.7, 1, 0.7, 0.4, 0.6, 0.9, 0.6, 0.4].map((h, i) => (
            <motion.div
              key={i}
              animate={{
                scaleY: [h, h * 2.5, h],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6, repeat: Infinity,
                delay: i * 0.07, ease: "easeInOut",
              }}
              style={{
                width: "3px", height: "16px",
                background: "#9B1C1C", borderRadius: "2px",
                transformOrigin: "center",
              }}
            />
          ))}
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px", color: "#9B1C1C",
            letterSpacing: "1.5px", marginLeft: "6px",
          }}>
            REC
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
