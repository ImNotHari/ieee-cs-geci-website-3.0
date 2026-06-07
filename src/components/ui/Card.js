/**
 * Card — Reusable glassmorphic container
 */

export default function Card({ children, className = "", style: extraStyle, animate = true }) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(15, 22, 36, 0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(110, 142, 168, 0.2)",
        borderRadius: "20px",
        padding: "32px 36px",
        boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
        animation: animate ? "memberFadeUp 0.5s ease-out both" : "none",
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
}
