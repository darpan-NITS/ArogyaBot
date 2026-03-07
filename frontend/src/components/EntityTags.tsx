entityTags.tsx:

import { MedicalEntities } from "@/types/chat";

interface Props {
  entities: MedicalEntities;
}

export default function EntityTags({ entities }: Props) {
  if (!entities || entities.symptoms?.length === 0) return null;

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: "6px",
      marginTop: "8px", marginBottom: "4px",
      padding: "0 16px",
    }}>
      {/* Symptoms */}
      {entities.symptoms?.map((s, i) => (
        <span key={i} style={{
          background: "rgba(224,123,57,0.09)",
          border: "1px solid rgba(224,123,57,0.25)",
          color: "#C96828", borderRadius: "4px",
          padding: "2px 8px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px", letterSpacing: "0.5px",
        }}>
          🔴 {s}
        </span>
      ))}

      {/* Duration */}
      {entities.duration && (
        <span style={{
          background: "rgba(176,125,42,0.09)",
          border: "1px solid rgba(176,125,42,0.25)",
          color: "#B07D2A", borderRadius: "4px",
          padding: "2px 8px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
        }}>
          ⏱ {entities.duration}
        </span>
      )}

      {/* Body parts */}
      {entities.body_parts?.map((p, i) => (
        <span key={i} style={{
          background: "rgba(92,45,110,0.08)",
          border: "1px solid rgba(92,45,110,0.20)",
          color: "#5C2D6E", borderRadius: "4px",
          padding: "2px 8px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
        }}>
          📍 {p}
        </span>
      ))}

      {/* Age */}
      {entities.age && (
        <span style={{
          background: "rgba(45,122,79,0.08)",
          border: "1px solid rgba(45,122,79,0.20)",
          color: "#2D7A4F", borderRadius: "4px",
          padding: "2px 8px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
        }}>
          👤 Age {entities.age}
        </span>
      )}
    </div>
  );
}
