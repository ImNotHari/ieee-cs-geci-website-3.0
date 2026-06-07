/**
 * StatBox — Reusable animated stat card
 */

export default function StatBox({ icon, value, label, variant = "default", delay = 0 }) {
  const variantStyles = {
    total:     { bg: "rgba(110,142,168,0.12)", color: "var(--accent-blue)" },
    published: { bg: "rgba(74,222,128,0.1)",   color: "#4ade80" },
    pending:   { bg: "rgba(251,191,36,0.1)",   color: "#fbbf24" },
    rejected:  { bg: "rgba(239,68,68,0.1)",    color: "#ef4444" },
    default:   { bg: "rgba(110,142,168,0.08)", color: "var(--text-gray)" },
  };

  const v = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className="member-stat-card"
      style={{ animationDelay: `${delay}s` }}
    >
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: v.bg, color: v.color, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span className="member-stat-value">{value}</span>
        <span className="member-stat-label">{label}</span>
      </div>
    </div>
  );
}
