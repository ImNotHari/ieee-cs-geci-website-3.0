"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

let toastId = 0;

// ── Icons ──────────────────────────────────────────────────
const SuccessIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const ErrorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TOAST_STYLES = {
  success: { bg: "rgba(74, 222, 128, 0.12)", border: "rgba(74, 222, 128, 0.25)", color: "#4ade80", icon: <SuccessIcon /> },
  error:   { bg: "rgba(239, 68, 68, 0.12)",  border: "rgba(239, 68, 68, 0.25)",  color: "#ef4444", icon: <ErrorIcon /> },
  info:    { bg: "rgba(110, 142, 168, 0.12)", border: "rgba(110, 142, 168, 0.25)", color: "#6e8ea8", icon: <InfoIcon /> },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  }, []);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    if (duration > 0) {
      timersRef.current[id] = setTimeout(() => removeToast(id), duration);
    }

    return id;
  }, [removeToast]);

  const toast = useCallback({
    success: (msg, dur) => addToast(msg, "success", dur),
    error:   (msg, dur) => addToast(msg, "error", dur),
    info:    (msg, dur) => addToast(msg, "info", dur),
  }, [addToast]);

  // Reassign to make it callable
  const toastApi = {
    success: (msg, dur) => addToast(msg, "success", dur),
    error:   (msg, dur) => addToast(msg, "error", dur),
    info:    (msg, dur) => addToast(msg, "info", dur),
  };

  return (
    <ToastContext.Provider value={toastApi}>
      {children}

      {/* Toast Container */}
      <div style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        display: "flex",
        flexDirection: "column-reverse",
        gap: "10px",
        zIndex: 10000,
        pointerEvents: "none",
      }}>
        {toasts.map((t) => {
          const style = TOAST_STYLES[t.type] || TOAST_STYLES.info;
          return (
            <div
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: "10px",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                pointerEvents: "auto",
                animation: t.exiting
                  ? "toastSlideOut 250ms ease-in forwards"
                  : "toastSlideIn 300ms ease-out forwards",
                maxWidth: "380px",
              }}
            >
              <span style={{ color: style.color, display: "flex", flexShrink: 0 }}>{style.icon}</span>
              <span style={{
                flex: 1,
                fontSize: "0.82rem",
                fontWeight: 500,
                color: "var(--text-white)",
                fontFamily: "var(--font-body)",
                lineHeight: 1.4,
              }}>
                {t.message}
              </span>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  padding: "2px",
                  flexShrink: 0,
                  transition: "color 150ms ease-out",
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "var(--text-white)"}
                onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
              >
                <CloseIcon />
              </button>
            </div>
          );
        })}
      </div>

      {/* Keyframes injected inline */}
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(40px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastSlideOut {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to   { opacity: 0; transform: translateX(40px) scale(0.95); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
