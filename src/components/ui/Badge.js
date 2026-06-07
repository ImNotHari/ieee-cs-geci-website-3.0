/**
 * Badge — Reusable status/role badge component
 */

const PRESETS = {
  // Roles
  admin:   { bg: "rgba(110,142,168,0.15)", border: "rgba(110,142,168,0.25)", color: "#6e8ea8" },
  execom:  { bg: "rgba(234,179,8,0.12)",   border: "rgba(234,179,8,0.25)",   color: "#f59e0b" },
  member:  { bg: "rgba(74,222,128,0.1)",    border: "rgba(74,222,128,0.2)",   color: "#4ade80" },

  // Event statuses
  draft:        { bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.2)",  color: "#94a3b8" },
  submitted:    { bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.2)",   color: "#fbbf24" },
  pending:      { bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.2)",   color: "#fbbf24" },
  under_review: { bg: "rgba(110,142,168,0.1)",  border: "rgba(110,142,168,0.2)",  color: "#6e8ea8" },
  approved:     { bg: "rgba(74,222,128,0.1)",   border: "rgba(74,222,128,0.2)",   color: "#4ade80" },
  published:    { bg: "rgba(74,222,128,0.1)",   border: "rgba(74,222,128,0.2)",   color: "#4ade80" },
  rejected:     { bg: "rgba(239,68,68,0.1)",    border: "rgba(239,68,68,0.2)",    color: "#ef4444" },
};

export default function Badge({ variant, label, style: extraStyle }) {
  const preset = PRESETS[variant] || PRESETS.member;
  const displayLabel = label || variant?.replace("_", " ");

  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "20px",
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: "0.65rem",
      letterSpacing: "1px",
      textTransform: "uppercase",
      background: preset.bg,
      color: preset.color,
      border: `1px solid ${preset.border}`,
      ...extraStyle,
    }}>
      {displayLabel}
    </span>
  );
}
