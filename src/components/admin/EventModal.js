"use client";

import { useState } from "react";
import { updateEvent, uploadEventFile } from "@/services/eventService";

const TAG_OPTIONS = ["workshop", "hackathon", "talk", "seminar", "competition", "webinar"];
const STATUS_OPTIONS = ["pending", "published", "rejected"];

export default function EventModal({ event, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    tag: event?.tag || "workshop",
    event_date: event?.event_date ? new Date(event.event_date).toISOString().split("T")[0] : "",
    time_string: event?.time_string || "",
    location: event?.location || "",
    registration_link: event?.registration_link || "",
    status: event?.status || "pending",
  });

  const [coverFile, setCoverFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const updates = { ...form };

      if (coverFile) {
        const res = await uploadEventFile(coverFile, "images");
        if (res.error) throw new Error("Image upload failed.");
        updates.cover_image_url = res.url;
        updates.cover_image_key = res.key;
      }

      if (docFile) {
        const res = await uploadEventFile(docFile, "documents");
        if (res.error) throw new Error("Document upload failed.");
        updates.document_url = res.url;
        updates.document_key = res.key;
      }

      const { data, error: saveError } = await updateEvent(event.id, updates);
      if (saveError) throw new Error(saveError.message);

      onSaved({ ...event, ...updates, ...data });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    setError("");
    try {
      const updates = { ...form, status: "published" };

      if (coverFile) {
        const res = await uploadEventFile(coverFile, "images");
        if (res.error) throw new Error("Image upload failed.");
        updates.cover_image_url = res.url;
        updates.cover_image_key = res.key;
      }

      if (docFile) {
        const res = await uploadEventFile(docFile, "documents");
        if (res.error) throw new Error("Document upload failed.");
        updates.document_url = res.url;
        updates.document_key = res.key;
      }

      const { data, error: saveError } = await updateEvent(event.id, updates);
      if (saveError) throw new Error(saveError.message);
      onSaved({ ...event, ...updates, ...data });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    setSaving(true);
    const { data, error: err } = await updateEvent(event.id, { status: "rejected" });
    setSaving(false);
    if (!err) onSaved({ ...event, status: "rejected", ...data });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
        <h2 className="modal-title">EDIT EVENT</h2>

        {error && <div className="modal-error">{error}</div>}

        <form className="modal-form" onSubmit={handleSave}>
          <div>
            <label className="modal-label">Title</label>
            <input className="modal-input" name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div>
            <label className="modal-label">Description</label>
            <textarea
              className="modal-input"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>

          <div className="modal-row">
            <div>
              <label className="modal-label">Category</label>
              <select className="modal-select" name="tag" value={form.tag} onChange={handleChange}>
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="modal-label">Status</label>
              <select className="modal-select" name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div>
              <label className="modal-label">Event Date</label>
              <input className="modal-input" type="date" name="event_date" value={form.event_date} onChange={handleChange} />
            </div>
            <div>
              <label className="modal-label">Time</label>
              <input className="modal-input" name="time_string" value={form.time_string} onChange={handleChange} placeholder="e.g. 10:00 AM – 12:00 PM" />
            </div>
          </div>

          <div>
            <label className="modal-label">Location</label>
            <input className="modal-input" name="location" value={form.location} onChange={handleChange} />
          </div>

          <div>
            <label className="modal-label">Registration Link</label>
            <input className="modal-input" type="url" name="registration_link" value={form.registration_link} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="modal-row">
            <div>
              <label className="modal-label">Cover Image</label>
              {event?.cover_image_url && !coverFile && (
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "6px" }}>Current image attached</p>
              )}
              <input type="file" accept="image/*" className="modal-input" style={{ padding: "8px" }} onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className="modal-label">Document (PDF)</label>
              {event?.document_url && !docFile && (
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "6px" }}>Current PDF attached</p>
              )}
              <input type="file" accept=".pdf" className="modal-input" style={{ padding: "8px" }} onChange={(e) => setDocFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          <div className="modal-actions" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {event?.status === "pending" && (
                <>
                  <button type="button" className="btn btn-primary" onClick={handlePublish} disabled={saving}>
                    Publish
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleReject} disabled={saving}>
                    Reject
                  </button>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
