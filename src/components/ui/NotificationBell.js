"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// Hardcoded mock notifications for demo purposes
const mockNotifications = [
  { id: 1, type: 'success', title: 'Event Approved', message: 'Your event "CodeStorm 3.0" is now published.', time: '2h ago', read: false },
  { id: 2, type: 'info', title: 'Review Required', message: 'Your proposal "AlgoArena" needs more details.', time: '1d ago', read: false },
  { id: 3, type: 'alert', title: 'System Maintenance', message: 'Dashboard will be offline for 10m tonight.', time: '2d ago', read: true },
];

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef} style={{ position: "relative" }}>
      <button 
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-gray)",
          cursor: "pointer",
          position: "relative",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          transition: "background 0.2s, color 0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.color = "var(--text-white)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--text-gray)";
        }}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            width: "8px",
            height: "8px",
            background: "#ef4444",
            borderRadius: "50%",
            border: "2px solid var(--bg-primary)"
          }} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: "320px",
              background: "rgba(15, 22, 36, 0.95)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(110, 142, 168, 0.2)",
              borderRadius: "16px",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
              zIndex: 50,
              overflow: "hidden"
            }}
          >
            <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "var(--text-white)" }}>Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  style={{ background: "none", border: "none", color: "var(--accent-blue)", fontSize: "0.75rem", cursor: "pointer" }}
                >
                  Mark all read
                </button>
              )}
            </div>
            
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  No new notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    style={{ 
                      padding: "16px", 
                      borderBottom: "1px solid rgba(255,255,255,0.02)",
                      display: "flex",
                      gap: "12px",
                      opacity: notif.read ? 0.6 : 1,
                      background: notif.read ? "transparent" : "rgba(110, 142, 168, 0.05)",
                      transition: "background 0.2s"
                    }}
                  >
                    <div style={{ 
                      marginTop: "2px",
                      color: notif.type === 'success' ? '#4ade80' : notif.type === 'alert' ? '#ef4444' : 'var(--accent-blue)' 
                    }}>
                      {notif.type === 'success' ? <CheckIcon /> : <AlertIcon />}
                    </div>
                    <div>
                      <h4 style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "var(--text-white)", fontWeight: 500 }}>
                        {notif.title}
                      </h4>
                      <p style={{ margin: "0 0 8px", fontSize: "0.8rem", color: "var(--text-gray)", lineHeight: 1.4 }}>
                        {notif.message}
                      </p>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{notif.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
