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
        background: "#0a1520",
        border: "1px solid #0e2530",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid #0e2530",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <span style={{ fontSize: "14px" }}>💊</span>
        <span style={{
          fontFamily: "'JetBrains Mono'",
          fontSize: "10px", color: "#00c9a7", letterSpacing: "1.5px",
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
            borderBottom: i < medicines.length - 1 ? "1px solid #0a1a24" : "none",
            alignItems: "center",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                <span style={{
                  fontFamily: "'Outfit'", fontSize: "13px",
                  color: "#c8daea", fontWeight: 500,
                }}>{med.brand}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontSize: "9px",
                  color: "#1e4060",
                }}>→</span>
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontSize: "10px",
                  color: "#00c9a7",
                }}>{med.generic}</span>
              </div>
              <div style={{
                fontFamily: "'Outfit'", fontSize: "11px",
                color: "#1e4060",
              }}>{med.use}</div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                <TrendingDown size={11} color="#00c9a7" />
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontSize: "11px",
                  color: "#00c9a7", fontWeight: 500,
                }}>{med.savings_pct}% off</span>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono'", fontSize: "9px",
                color: "#1e4060",
              }}>
                <span style={{ textDecoration: "line-through" }}>₹{med.price_brand}</span>
                {" → "}
                <span style={{ color: "#6dceaa" }}>₹{med.price_generic}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{
        padding: "8px 16px",
        borderTop: "1px solid #0a1a24",
        fontFamily: "'JetBrains Mono'",
        fontSize: "9px", color: "#1e3a50",
        letterSpacing: "0.5px",
      }}>
        ⚠ Always consult a doctor before taking any medicine
      </div>
    </motion.div>
  );
}
