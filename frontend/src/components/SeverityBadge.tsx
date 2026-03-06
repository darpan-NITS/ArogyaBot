const config = {
  mild:      { label: "MILD",      color: "#5ba8a0", bg: "rgba(91,168,160,0.1)"  },
  moderate:  { label: "MODERATE",  color: "#e8c97a", bg: "rgba(232,201,122,0.1)" },
  urgent:    { label: "URGENT",    color: "#e0876a", bg: "rgba(224,135,106,0.1)" },
  emergency: { label: "EMERGENCY", color: "#e05a5a", bg: "rgba(224,90,90,0.1)"   },
};

export default function SeverityBadge({ level }: { level: string }) {
  const c = config[level as keyof typeof config];
  if (!c) return null;
  return (
    <span style={{
      background: c.bg,
      border: `1px solid ${c.color}40`,
      color: c.color,
      borderRadius: "4px",
      padding: "2px 10px",
      fontSize: "10px",
      fontFamily: "'JetBrains Mono'",
      letterSpacing: "2px",
      fontWeight: 500,
    }}>
      ● {c.label}
    </span>
  );
}
