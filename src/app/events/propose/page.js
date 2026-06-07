"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getSession, submitEventRequest, uploadEventFile } from "@/lib/supabase";
import "../events.css";

const TAG_OPTIONS = ["workshop", "hackathon", "talk", "seminar", "competition", "webinar"];

export default function ProposeEventPage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = loading
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

  useEffect(() => {
    async function check() {
      const s = await getSession();
      if (!s) {
        router.push("/login");
      } else {
        setSession(s);
      }
    }
    check();
  }, [router]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        created_by: session.user.id,
      });

      if (submitError) throw new Error(submitError.message);

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (session === undefined) {
    return (
      <div className="events-page">
        <Header />
        <div style={{ padding: "200px 60px", textAlign: "center", color: "var(--text-muted)" }}>
          Checking authentication...
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <Header />

      <section className="events-hero">
        <div className="events-hero-content">
          <div className="events-breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <Link href="/events">Events</Link>
            <span className="separator">/</span>
            <span>Propose</span>
          </div>
          <h1 className="events-page-title">
            PROPOSE AN <span>EVENT.</span>
          </h1>
          <p className="events-page-subtitle">
            Submit your event idea. An admin will review the details and publish it once approved.
          </p>
        </div>
      </section>

      <div className="propose-form-container">
        {success ? (
          <div className="propose-success">
            <div className="propose-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="propose-success-title">EVENT SUBMITTED</h2>
            <p className="propose-success-text">
              Your event has been sent to the admin team for review. You&apos;ll be notified once it&apos;s published.
            </p>
            <Link href="/events" className="propose-back-btn">
              Back to Events →
            </Link>
          </div>
        ) : (
          <form className="propose-form" onSubmit={handleSubmit}>
            {error && <div className="propose-error">{error}</div>}

            <div className="propose-field">
              <label className="propose-label">Event Title *</label>
              <input
                type="text"
                name="title"
                className="propose-input"
                placeholder="e.g. Full-Stack Development Bootcamp"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="propose-field">
              <label className="propose-label">Description *</label>
              <textarea
                name="description"
                className="propose-input propose-textarea"
                placeholder="Describe what the event covers, who should attend, and what they'll learn..."
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>

            <div className="propose-row">
              <div className="propose-field">
                <label className="propose-label">Category *</label>
                <select name="tag" className="propose-input" value={form.tag} onChange={handleChange}>
                  {TAG_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="propose-field">
                <label className="propose-label">Event Date *</label>
                <input
                  type="date"
                  name="event_date"
                  className="propose-input"
                  value={form.event_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="propose-row">
              <div className="propose-field">
                <label className="propose-label">Time</label>
                <input
                  type="text"
                  name="time_string"
                  className="propose-input"
                  placeholder="e.g. 10:30 AM – 12:00 PM"
                  value={form.time_string}
                  onChange={handleChange}
                />
              </div>
              <div className="propose-field">
                <label className="propose-label">Location</label>
                <input
                  type="text"
                  name="location"
                  className="propose-input"
                  placeholder="e.g. Auditorium, Block A"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="propose-field">
              <label className="propose-label">Registration Link</label>
              <input
                type="url"
                name="registration_link"
                className="propose-input"
                placeholder="https://..."
                value={form.registration_link}
                onChange={handleChange}
              />
            </div>

            <div className="propose-row">
              <div className="propose-field">
                <label className="propose-label">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="propose-input propose-file"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="propose-field">
                <label className="propose-label">Document (PDF)</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="propose-input propose-file"
                  onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <button type="submit" className="propose-submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit for Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
