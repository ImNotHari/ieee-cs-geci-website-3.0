"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentMember } from "@/services/authService";
import { submitEventRequest, uploadEventFile } from "@/services/eventService";
import { useToast } from "@/components/Toast";
import Card from "@/components/ui/Card";

const TAG_OPTIONS = ["workshop", "hackathon", "talk", "seminar", "competition", "webinar"];

export default function ProposeEventPage() {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    tag: "workshop",
    event_date: "",
    time_string: "",
    location: "",
    registration_link: "",
  });
  const [coverFile, setCoverFile] = useState(null);
  const [docFile, setDocFile] = useState(null);

  // Auth check handled by middleware and layout, but we need member.id
  const { data: member, isLoading: memberLoading } = useQuery({
    queryKey: ["currentMember"],
    queryFn: getCurrentMember,
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member) return;

    setError("");
    setSubmitting(true);

    try {
      let cover_image_url = null;
      let cover_image_key = null;
      let document_url = null;
      let document_key = null;

      if (coverFile) {
        const res = await uploadEventFile(coverFile, "images");
        if (res.error) throw new Error("Failed to upload cover image.");
        cover_image_url = res.url;
        cover_image_key = res.key;
      }

      if (docFile) {
        const res = await uploadEventFile(docFile, "documents");
        if (res.error) throw new Error("Failed to upload document.");
        document_url = res.url;
        document_key = res.key;
      }

      const { error: submitError } = await submitEventRequest({
        ...form,
        cover_image_url,
        cover_image_key,
        document_url,
        document_key,
        created_by: member.id,
      });

      if (submitError) throw new Error(submitError.message);

      setSuccess(true);
      toast.success("Event submitted successfully! It's now pending review.");
      queryClient.invalidateQueries({ queryKey: ["memberEvents"] });
    } catch (err) {
      setError(err.message || "Something went wrong.");
      toast.error(err.message || "Failed to submit event.");
    } finally {
      setSubmitting(false);
    }
  };

  if (memberLoading) {
    return (
      <main className="member-main">
        <div className="member-topbar">
          <h1 className="member-topbar-title">PROPOSE EVENT</h1>
        </div>
        <div className="member-content">
          <div className="skeleton skeleton-profile" style={{ height: "400px" }} />
        </div>
      </main>
    );
  }

  return (
    <main className="member-main">
      <div className="member-topbar">
        <h1 className="member-topbar-title">PROPOSE EVENT</h1>
      </div>

      <div className="member-content">
        <Card style={{ display: "block", maxWidth: "800px", margin: "0 auto" }}>
          
          <div style={{ marginBottom: "24px" }}>
            <h2 className="member-profile-name" style={{ fontSize: "1.2rem" }}>Submit an Idea</h2>
            <p className="member-profile-email">
              Submit your event idea below. Once reviewed by the admin team, it will be published to the main site.
            </p>
          </div>

          {success ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ color: "#4ade80", marginBottom: "16px" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto" }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="member-profile-name" style={{ marginBottom: "12px", fontSize: "1.3rem" }}>Event Submitted Successfully</h2>
              <p className="member-profile-email" style={{ marginBottom: "24px" }}>
                Your event is now pending review.
              </p>
              <Link href="/member/dashboard" className="member-action-btn primary">
                Back to Dashboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {error && (
                <div style={{ padding: "12px 16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", color: "#ef4444", fontSize: "0.85rem" }}>
                  {error}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label className="member-detail-label">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none", width: "100%", fontFamily: "var(--font-body)" }}
                  placeholder="e.g. Full-Stack Development Bootcamp"
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label className="member-detail-label">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none", width: "100%", fontFamily: "var(--font-body)", resize: "vertical" }}
                  placeholder="Describe what the event covers, who should attend..."
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label className="member-detail-label">Category *</label>
                  <select 
                    name="tag" 
                    value={form.tag} 
                    onChange={handleChange}
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none", width: "100%", fontFamily: "var(--font-body)" }}
                  >
                    {TAG_OPTIONS.map((t) => (
                      <option key={t} value={t} style={{ background: "var(--bg-primary)" }}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label className="member-detail-label">Event Date *</label>
                  <input
                    type="date"
                    name="event_date"
                    value={form.event_date}
                    onChange={handleChange}
                    required
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none", width: "100%", fontFamily: "var(--font-body)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label className="member-detail-label">Time</label>
                  <input
                    type="text"
                    name="time_string"
                    value={form.time_string}
                    onChange={handleChange}
                    placeholder="e.g. 10:30 AM – 12:00 PM"
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none", width: "100%", fontFamily: "var(--font-body)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label className="member-detail-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Auditorium"
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none", width: "100%", fontFamily: "var(--font-body)" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label className="member-detail-label">Registration Link</label>
                <input
                  type="url"
                  name="registration_link"
                  value={form.registration_link}
                  onChange={handleChange}
                  placeholder="https://..."
                  style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none", width: "100%", fontFamily: "var(--font-body)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label className="member-detail-label">Cover Image</label>
                  <label style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: "20px", border: "2px dashed rgba(110,142,168,0.3)", borderRadius: "8px",
                    background: "rgba(0,0,0,0.1)", cursor: "pointer", transition: "all 200ms ease-out"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--accent-blue)"}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = "rgba(110,142,168,0.3)"}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "8px" }}>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-gray)", fontFamily: "var(--font-body)" }}>
                      {coverFile ? coverFile.name : "Click to upload image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label className="member-detail-label">Document (PDF)</label>
                  <label style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: "20px", border: "2px dashed rgba(110,142,168,0.3)", borderRadius: "8px",
                    background: "rgba(0,0,0,0.1)", cursor: "pointer", transition: "all 200ms ease-out"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--accent-blue)"}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = "rgba(110,142,168,0.3)"}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "8px" }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-gray)", fontFamily: "var(--font-body)" }}>
                      {docFile ? docFile.name : "Click to upload PDF"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>

              <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="member-action-btn primary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Proposal"}
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
