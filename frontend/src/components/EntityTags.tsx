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
          background: "rgba(0,201,167,0.08)",
          border: "1px solid rgba(0,201,167,0.2)",
          color: "#00c9a7", borderRadius: "4px",
          padding: "2px 8px",
          fontFamily: "'JetBrains Mono'",
          fontSize: "10px", letterSpacing: "0.5px",
        }}>
          🔴 {s}
        </span>
      ))}

      {/* Duration */}
      {entities.duration && (
        <span style={{
          background: "rgba(255,209,102,0.08)",
          border: "1px solid rgba(255,209,102,0.2)",
          color: "#ffd166", borderRadius: "4px",
          padding: "2px 8px",
          fontFamily: "'JetBrains Mono'",
          fontSize: "10px",
        }}>
          ⏱ {entities.duration}
        </span>
      )}

      {/* Body parts */}
      {entities.body_parts?.map((p, i) => (
        <span key={i} style={{
          background: "rgba(167,139,250,0.08)",
          border: "1px solid rgba(167,139,250,0.2)",
          color: "#a78bfa", borderRadius: "4px",
          padding: "2px 8px",
          fontFamily: "'JetBrains Mono'",
          fontSize: "10px",
        }}>
          📍 {p}
        </span>
      ))}

      {/* Age */}
      {entities.age && (
        <span style={{
          background: "rgba(59,158,255,0.08)",
          border: "1px solid rgba(59,158,255,0.2)",
          color: "#3b9eff", borderRadius: "4px",
          padding: "2px 8px",
          fontFamily: "'JetBrains Mono'",
          fontSize: "10px",
        }}>
          👤 Age {entities.age}
        </span>
      )}
    </div>
  );
}
