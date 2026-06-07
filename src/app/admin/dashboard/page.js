"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchMembers, deleteMember, getCurrentMember, signOut } from "@/lib/supabase";
import MemberModal from "@/components/admin/MemberModal";

// ── Icons ──────────────────────────────────────────────────
const UsersIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ShieldIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const StarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const UsersIconLarge = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const LogOutIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const ClipboardListIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>;

export default function AdminDashboardPage() {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Load data ──────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    const [admin, { data }] = await Promise.all([getCurrentMember(), fetchMembers()]);
    setCurrentAdmin(admin);
    setMembers(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Filter ────────────────────────────────────────────────
  useEffect(() => {
    let list = members;
    if (roleFilter !== "all") list = list.filter((m) => m.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.full_name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q) ||
          m.ieee_member_id?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [members, search, roleFilter]);

  // ── Handlers ──────────────────────────────────────────────
  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleMemberSaved = (savedMember) => {
    setMembers((prev) => {
      const exists = prev.find((m) => m.id === savedMember.id);
      if (exists) return prev.map((m) => (m.id === savedMember.id ? savedMember : m));
      return [savedMember, ...prev];
    });
    setShowAddModal(false);
    setEditingMember(null);
  };

  const handleDelete = async () => {
    if (!deletingMember) return;
    setDeleteLoading(true);
    const { error } = await deleteMember(deletingMember.id);
    setDeleteLoading(false);
    if (!error) {
      setMembers((prev) => prev.filter((m) => m.id !== deletingMember.id));
      setDeletingMember(null);
    }
  };

  // ── Computed stats ─────────────────────────────────────────
  const stats = {
    total:   members.length,
    admins:  members.filter((m) => m.role === "admin").length,
    execom:  members.filter((m) => m.role === "execom").length,
    regular: members.filter((m) => m.role === "member").length,
  };

  const roleBadgeClass = (role) =>
    ({ admin: "role-admin", execom: "role-execom", member: "role-member" }[role] ?? "role-member");

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ display: "flex" }}>

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src="/assets/ieee-logo-geci.png" alt="IEEE CS GECI" />
          <p className="sidebar-label">Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <Link href="/admin/dashboard" className="sidebar-link active">
            <span className="icon" style={{ display: 'flex' }}><UsersIcon /></span> Members
          </Link>
          <Link href="/admin/events" className="sidebar-link">
            <span className="icon" style={{ display: 'flex' }}>📅</span> Events
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

        {/* Top Bar */}
        <div className="admin-topbar">
          <h1 className="admin-topbar-title">DASHBOARD</h1>
          <div className="admin-topbar-right">
            <span className="admin-badge">Admin</span>
          </div>
        </div>

        <div className="admin-content">

          {/* Stats */}
          <div className="admin-stats">
            {[
              { icon: <UsersIconLarge />, label: "Total Members", value: stats.total },
              { icon: <ShieldIcon />, label: "Admins",        value: stats.admins },
              { icon: <StarIcon />, label: "Execom",         value: stats.execom },
              { icon: <UserIcon />, label: "Regular Members",value: stats.regular },
            ].map((s) => (
              <div className="admin-stat-card" key={s.label}>
                <div className="stat-card-icon">{s.icon}</div>
                <div className="stat-card-label">{s.label}</div>
                <div className="stat-card-value">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Members Table */}
          <div className="table-section">
            <div className="table-header">
              <h2 className="table-header-title">MEMBERS</h2>
              <div className="table-controls">
                <input
                  type="search"
                  className="table-search"
                  placeholder="Search by name, email, ID…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="modal-select"
                  style={{ width: "auto", padding: "10px 14px" }}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="execom">Execom</option>
                  <option value="member">Member</option>
                </select>
                <button
                  className="btn btn-primary"
                  id="add-member-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  + Add Member
                </button>
              </div>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>IEEE ID</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Year</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="loading-row">
                      <td colSpan={7}>Loading members…</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="empty-state">
                          <div className="empty-icon" style={{ opacity: 0.5, marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><ClipboardListIcon /></div>
                          <div className="empty-title">No Members Found</div>
                          <div className="empty-text">
                            {search || roleFilter !== "all"
                              ? "Try adjusting your search or filters."
                              : 'Click "Add Member" to get started.'}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((m) => (
                      <tr key={m.id}>
                        <td className="member-name">{m.full_name}</td>
                        <td className="member-id">{m.ieee_member_id || "—"}</td>
                        <td>{m.email}</td>
                        <td>
                          <span className={`role-badge ${roleBadgeClass(m.role)}`}>
                            {m.role}
                          </span>
                        </td>
                        <td>{m.year || "—"}</td>
                        <td>{m.department || "—"}</td>
                        <td>
                          <div className="action-cell">
                            <button
                              className="action-btn action-edit"
                              onClick={() => setEditingMember(m)}
                            >
                              Edit
                            </button>
                            <button
                              className="action-btn action-delete"
                              onClick={() => setDeletingMember(m)}
                            >
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

            {!loading && filtered.length > 0 && (
              <div className="table-footer">
                <span className="table-footer-info">
                  Showing {filtered.length} of {members.length} member{members.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Add Modal ──────────────────────────────────────── */}
      {showAddModal && (
        <MemberModal
          member={null}
          onClose={() => setShowAddModal(false)}
          onSaved={handleMemberSaved}
        />
      )}

      {/* ── Edit Modal ─────────────────────────────────────── */}
      {editingMember && (
        <MemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSaved={handleMemberSaved}
        />
      )}

      {/* ── Delete Confirm ──────────────────────────────────── */}
      {deletingMember && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeletingMember(null)}>
          <div className="modal confirm-dialog">
            <h2 className="modal-title">DELETE MEMBER</h2>
            <p className="confirm-text">
              Are you sure you want to remove{" "}
              <strong style={{ color: "var(--text-white)" }}>
                {deletingMember.full_name}
              </strong>{" "}
              from the system? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeletingMember(null)} disabled={deleteLoading}>
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
