"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentMember, signOut } from "@/services/authService";
import { fetchAdminEvents, deleteEvent } from "@/services/eventService";
import { formatDate } from "@/utils/dateUtils";
import EventModal from "@/components/admin/EventModal";

// ── Icons ──────────────────────────────────────────────────
const UsersIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const CalendarIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const LogOutIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CheckIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const FileTextIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;



export default function AdminEventsPage() {
  const router = useRouter();
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [events, setEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [admin, { data }] = await Promise.all([getCurrentMember(), fetchAdminEvents(statusFilter)]);
    setCurrentAdmin(admin);
    setEvents(data ?? []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleEventSaved = (savedEvent) => {
    setEvents((prev) => {
      const exists = prev.find((e) => e.id === savedEvent.id);
      if (exists) return prev.map((e) => (e.id === savedEvent.id ? savedEvent : e));
      return [savedEvent, ...prev];
    });
    setEditingEvent(null);
  };

  const handleDelete = async () => {
    if (!deletingEvent) return;
    setDeleteLoading(true);
    const { error } = await deleteEvent(deletingEvent.id);
    setDeleteLoading(false);
    if (!error) {
      setEvents((prev) => prev.filter((e) => e.id !== deletingEvent.id));
      setDeletingEvent(null);
    }
  };

  const stats = {
    total: events.length,
    pending: events.filter((e) => e.status === "pending").length,
    published: events.filter((e) => e.status === "published").length,
    rejected: events.filter((e) => e.status === "rejected").length,
  };

  const statusBadgeClass = (status) =>
    ({ pending: "status-pending", published: "status-published", rejected: "status-rejected" }[status] ?? "status-pending");

  return (
    <div style={{ display: "flex" }}>
      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src="/assets/ieee-logo-geci.png" alt="IEEE CS GECI" />
          <p className="sidebar-label">Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <Link href="/admin/dashboard" className="sidebar-link">
            <span className="icon" style={{ display: 'flex' }}><UsersIcon /></span> Members
          </Link>
          <Link href="/admin/events" className="sidebar-link active">
            <span className="icon" style={{ display: 'flex' }}><CalendarIcon /></span> Events
          </Link>
        </nav>

        <div className="sidebar-footer">
          {currentAdmin && (
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "12px" }}>
              Signed in as<br />
              <span style={{ color: "var(--text-gray)", fontWeight: 500 }}>
                {currentAdmin.full_name || currentAdmin.email}
              </span>
            </p>
          )}
          <button className="sidebar-signout" onClick={handleSignOut}>
            <span style={{ display: 'flex' }}><LogOutIcon /></span> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────── */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-topbar-title">EVENTS</h1>
          <div className="admin-topbar-right">
            <span className="admin-badge">Admin</span>
          </div>
        </div>

        <div className="admin-content">
          {/* Stats */}
          <div className="admin-stats">
            {[
              { icon: <CalendarIcon />, label: "Total Events", value: stats.total },
              { icon: <ClockIcon />, label: "Pending Review", value: stats.pending },
              { icon: <CheckIcon />, label: "Published", value: stats.published },
              { icon: <XIcon />, label: "Rejected", value: stats.rejected },
            ].map((s) => (
              <div className="admin-stat-card" key={s.label}>
                <div className="stat-card-icon">{s.icon}</div>
                <div className="stat-card-label">{s.label}</div>
                <div className="stat-card-value">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Events Table */}
          <div className="table-section">
            <div className="table-header">
              <h2 className="table-header-title">EVENT REQUESTS</h2>
              <div className="table-controls">
                <select
                  className="modal-select"
                  style={{ width: "auto", padding: "10px 14px" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Assets</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="loading-row">
                      <td colSpan={7}>Loading events…</td>
                    </tr>
                  ) : events.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="empty-state">
                          <div className="empty-icon" style={{ opacity: 0.5, marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><FileTextIcon /></div>
                          <div className="empty-title">No Events Found</div>
                          <div className="empty-text">
                            {statusFilter !== "all"
                              ? "Try selecting a different status filter."
                              : "No event requests have been submitted yet."}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    events.map((ev) => (
                      <tr key={ev.id}>
                        <td className="member-name">{ev.title}</td>
                        <td>
                          <span className={`event-tag-badge tag-${ev.tag}`}>{ev.tag}</span>
                        </td>
                        <td>{formatDate(ev.event_date)}</td>
                        <td>{ev.location || "—"}</td>
                        <td>
                          <span className={`role-badge ${statusBadgeClass(ev.status)}`}>
                            {ev.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            {ev.cover_image_url && (
                              <span style={{ fontSize: "0.7rem", color: "var(--accent-blue)", background: "rgba(110,142,168,0.1)", padding: "2px 8px", borderRadius: "10px" }}>IMG</span>
                            )}
                            {ev.document_url && (
                              <span style={{ fontSize: "0.7rem", color: "#4ade80", background: "rgba(74,222,128,0.1)", padding: "2px 8px", borderRadius: "10px" }}>PDF</span>
                            )}
                            {ev.registration_link && (
                              <span style={{ fontSize: "0.7rem", color: "#d4a87a", background: "rgba(168,143,110,0.1)", padding: "2px 8px", borderRadius: "10px" }}>LINK</span>
                            )}
                            {!ev.cover_image_url && !ev.document_url && !ev.registration_link && "—"}
                          </div>
                        </td>
                        <td>
                          <div className="action-cell">
                            <button className="action-btn action-edit" onClick={() => setEditingEvent(ev)}>
                              Edit
                            </button>
                            <button className="action-btn action-delete" onClick={() => setDeletingEvent(ev)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!loading && events.length > 0 && (
              <div className="table-footer">
                <span className="table-footer-info">
                  Showing {events.length} event{events.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Edit Modal ───────────────────────────────────── */}
      {editingEvent && (
        <EventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSaved={handleEventSaved}
        />
      )}

      {/* ── Delete Confirm ──────────────────────────────── */}
      {deletingEvent && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeletingEvent(null)}>
          <div className="modal confirm-dialog">
            <h2 className="modal-title">DELETE EVENT</h2>
            <p className="confirm-text">
              Are you sure you want to remove{" "}
              <strong style={{ color: "var(--text-white)" }}>
                {deletingEvent.title}
              </strong>{" "}
              from the system? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeletingEvent(null)} disabled={deleteLoading}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
