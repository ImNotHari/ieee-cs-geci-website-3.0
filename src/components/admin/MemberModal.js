"use client";

import { useState } from "react";
import { addMember, updateMember } from "@/services/memberService";

const ROLES = ["member", "execom", "admin"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"];

const EMPTY_FORM = {
  full_name: "",
  email: "",
  ieee_member_id: "",
  role: "member",
  department: "",
  year: "",
  phone: "",
};

export default function MemberModal({ member, onClose, onSaved }) {
  const isEditing = Boolean(member);
  const [form, setForm] = useState(isEditing ? { ...member } : { ...EMPTY_FORM });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [newMemberData, setNewMemberData] = useState(null);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let result;
    if (isEditing) {
      const { id, created_at, ...updates } = form;
      result = await updateMember(member.id, updates);
    } else {
      result = await addMember(form);
    }

    setLoading(false);

    if (result.error) {
      setError(result.error.message || "Something went wrong. Please try again.");
      return;
    }

    if (!isEditing && result.data && result.data.password) {
      // Show password screen
      setGeneratedPassword(result.data.password);
      setNewMemberData(result.data.memberData);
    } else {
      onSaved(result.data);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    alert("Password copied to clipboard!");
  };

  const handleFinalClose = () => {
    onSaved(newMemberData);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
        {generatedPassword ? (
          <div className="modal-success-state" style={{ textAlign: "center", padding: "20px 0" }}>
            <h2 className="modal-title" style={{ color: "var(--success)" }}>USER CREATED!</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
              Please copy this randomly generated password. The user will need it to log in.
            </p>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <code style={{ fontSize: "1.2rem", color: "white", letterSpacing: "2px" }}>{generatedPassword}</code>
              <button type="button" className="btn btn-primary" onClick={handleCopyPassword} style={{ padding: "8px 16px" }}>
                Copy
              </button>
            </div>
            <button type="button" className="btn btn-primary" onClick={handleFinalClose} style={{ width: "100%" }}>
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 className="modal-title" id="modal-heading">
              {isEditing ? "EDIT MEMBER" : "ADD MEMBER"}
            </h2>

            {error && <div className="modal-error">{error}</div>}

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-row">
            <div>
              <label className="modal-label" htmlFor="m-fullname">Full Name</label>
              <input
                id="m-fullname"
                className="modal-input"
                value={form.full_name}
                onChange={set("full_name")}
                placeholder="e.g. Alex Thomas"
                required
              />
            </div>
            <div>
              <label className="modal-label" htmlFor="m-memberid">IEEE Member ID</label>
              <input
                id="m-memberid"
                className="modal-input"
                value={form.ieee_member_id}
                onChange={set("ieee_member_id")}
                placeholder="e.g. 98765432"
              />
            </div>
          </div>

          <div>
            <label className="modal-label" htmlFor="m-email">Email Address</label>
            <input
              id="m-email"
              type="email"
              className="modal-input"
              value={form.email}
              onChange={set("email")}
              placeholder="member@ieee.org"
              required
              disabled={isEditing}
            />
          </div>

          <div className="modal-row">
            <div>
              <label className="modal-label" htmlFor="m-role">Role</label>
              <select id="m-role" className="modal-select" value={form.role} onChange={set("role")}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="modal-label" htmlFor="m-year">Year</label>
              <select id="m-year" className="modal-select" value={form.year} onChange={set("year")}>
                <option value="">Select Year</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div>
              <label className="modal-label" htmlFor="m-dept">Department</label>
              <input
                id="m-dept"
                className="modal-input"
                value={form.department}
                onChange={set("department")}
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <label className="modal-label" htmlFor="m-phone">Phone</label>
              <input
                id="m-phone"
                className="modal-input"
                value={form.phone}
                onChange={set("phone")}
                placeholder="e.g. +91 9876543210"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving…" : isEditing ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
}
