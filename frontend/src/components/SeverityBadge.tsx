const config = {
  mild:      { label: "MILD",      color: "#2D7A4F", bg: "rgba(45,122,79,0.10)"   },
  moderate:  { label: "MODERATE",  color: "#B07D2A", bg: "rgba(176,125,42,0.10)"  },
  urgent:    { label: "URGENT",    color: "#C96828", bg: "rgba(201,104,40,0.10)"   },
  emergency: { label: "EMERGENCY", color: "#9B1C1C", bg: "rgba(155,28,28,0.10)"   },
};

export default function SeverityBadge({ level }: { level: string }) {
  const c = config[level as keyof typeof config];
  if (!c) return null;

  return (
    <span style={{
      background: c.bg,
      border: `1px solid ${c.color}50`,
      color: c.color,
      borderRadius: "4px",
      padding: "2px 10px",
      fontSize: "10px",
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "2px",
      fontWeight: 500,
    }}>
      ● {c.label}
    </span>
  );
}
