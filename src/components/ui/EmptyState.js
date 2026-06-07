/**
 * EmptyState — Reusable empty/error placeholder
 */

export default function EmptyState({ icon, title, text, action }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "48px 24px",
    }}>
      {icon && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px", opacity: 0.4, color: "var(--text-muted)" }}>
          {icon}
        </div>
      )}
      {title && (
        <div style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "1.1rem",
          letterSpacing: "2px",
          color: "var(--text-gray)",
          marginBottom: "8px",
        }}>
          {title}
        </div>
      )}
      {text && (
        <div style={{
          fontFamily: "var(--font-body)",
          fontWeight: 300,
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          marginBottom: action ? "20px" : "0",
        }}>
          {text}
        </div>
      )}
      {action}
    </div>
  );
}
