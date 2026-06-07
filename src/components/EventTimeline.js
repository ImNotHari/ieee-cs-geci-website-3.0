/**
 * EventTimeline — Visual progression tracker for event workflow
 *
 * Statuses in order: draft → submitted → under_review → approved / rejected → published
 */

const STEPS = [
  { key: "draft",        label: "Draft" },
  { key: "submitted",    label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "approved",     label: "Approved" },
  { key: "published",    label: "Published" },
];

const STATUS_INDEX = {
  draft: 0,
  submitted: 1,
  pending: 1, // legacy alias
  under_review: 2,
  approved: 3,
  published: 4,
  rejected: -1, // special
};

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function EventTimeline({ status = "draft" }) {
  const isRejected = status === "rejected";
  const currentIndex = STATUS_INDEX[status] ?? 0;

  if (isRejected) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {STEPS.slice(0, 3).map((step, i) => {
            const completed = i < 2; // submitted and draft are done before rejection
            return (
              <div key={step.key} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: completed ? "rgba(110,142,168,0.2)" : "rgba(239,68,68,0.15)",
                  border: completed ? "2px solid var(--accent-blue)" : "2px solid #ef4444",
                  color: completed ? "var(--accent-blue)" : "#ef4444",
                  fontSize: "0.7rem", fontWeight: 700,
                  transition: "all 300ms ease-out",
                }}>
                  {completed ? <CheckIcon /> : <XIcon />}
                </div>
                {i < 2 && (
                  <div style={{
                    width: "32px", height: "2px",
                    background: completed ? "var(--accent-blue)" : "rgba(239,68,68,0.3)",
                    borderRadius: "1px",
                  }} />
                )}
              </div>
            );
          })}
        </div>
        <div style={{
          fontSize: "0.7rem", fontWeight: 600, letterSpacing: "1px",
          textTransform: "uppercase", color: "#ef4444", marginTop: "4px",
          fontFamily: "var(--font-body)",
        }}>
          Rejected
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
      {STEPS.map((step, i) => {
        const completed = i < currentIndex;
        const active = i === currentIndex;
        const future = i > currentIndex;

        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: completed ? "rgba(74,222,128,0.15)" : active ? "rgba(110,142,168,0.2)" : "rgba(255,255,255,0.04)",
                border: completed ? "2px solid #4ade80" : active ? "2px solid var(--accent-blue)" : "2px solid rgba(255,255,255,0.1)",
                color: completed ? "#4ade80" : active ? "var(--accent-blue)" : "var(--text-muted)",
                fontSize: "0.65rem", fontWeight: 700,
                transition: "all 300ms ease-out",
              }}>
                {completed ? <CheckIcon /> : (i + 1)}
              </div>
              <span style={{
                fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: completed ? "#4ade80" : active ? "var(--accent-blue)" : "var(--text-muted)",
                fontFamily: "var(--font-body)",
                whiteSpace: "nowrap",
                transition: "color 300ms ease-out",
              }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                width: "28px", height: "2px",
                background: completed ? "#4ade80" : "rgba(255,255,255,0.08)",
                borderRadius: "1px",
                margin: "0 4px",
                marginBottom: "18px",
                transition: "background 300ms ease-out",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
