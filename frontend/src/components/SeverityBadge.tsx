import clsx from "clsx";

const config = {
    mild:      { label: "MILD",      color: "#00c9a7", bg: "rgba(0,201,167,0.1)"  },
    moderate:  { label: "MODERATE",  color: "#ffd166", bg: "rgba(255,209,102,0.1)" },
    urgent:    { label: "URGENT",    color: "#ff9a3c", bg: "rgba(255,154,60,0.1)"  },
    emergency: { label: "EMERGENCY", color: "#ff6b6b", bg: "rgba(255,107,107,0.1)" },
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