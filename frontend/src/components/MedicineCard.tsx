"use client";
import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";

interface Medicine {
  id:            string;
  brand:         string;
  generic:       string;
  price_brand:   number;
  price_generic: number;
  category:      string;
  use:           string;
  savings_pct:   number;
}

interface Props {
  medicines: Medicine[];
}

export default function MedicineCard({ medicines }: Props) {
  if (!medicines || medicines.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        margin: "8px 16px",
        background: "#F2EDE6",
        border: "1px solid #DDD4C4",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "11px 16px",
        borderBottom: "1px solid #DDD4C4",
        display: "flex", alignItems: "center", gap: "8px",
        background: "rgba(224,123,57,0.05)",
      }}>
        <span style={{ fontSize: "14px" }}>💊</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px", color: "#E07B39", letterSpacing: "1.5px",
        }}>
          JAN AUSHADHI GENERIC ALTERNATIVES
        </span>
      </div>

      {/* Medicine list */}
      <div style={{ padding: "8px" }}>
        {medicines.slice(0, 4).map((med, i) => (
          <div key={med.id} style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "8px",
            padding: "10px 8px",
            borderBottom: i < Math.min(medicines.length, 4) - 1
              ? "1px solid #EAE2D8" : "none",
            alignItems: "center",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px", color: "#1C1208", fontWeight: 500,
                }}>{med.brand}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px", color: "#9A8472",
                }}>→</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px", color: "#E07B39",
                }}>{med.generic}</span>
              </div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "11px", color: "#9A8472",
              }}>{med.use}</div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                <TrendingDown size={11} color="#2D7A4F" />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px", color: "#2D7A4F", fontWeight: 500,
                }}>{med.savings_pct}% off</span>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px", color: "#9A8472",
              }}>
                <span style={{ textDecoration: "line-through" }}>₹{med.price_brand}</span>
                {" → "}
                <span style={{ color: "#2D7A4F" }}>₹{med.price_generic}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{
        padding: "8px 16px",
        borderTop: "1px solid #EAE2D8",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "9px", color: "#9A8472",
        letterSpacing: "0.3px",
      }}>
        ⚠ Always consult a doctor before taking any medicine
      </div>
    </motion.div>
  );
}
