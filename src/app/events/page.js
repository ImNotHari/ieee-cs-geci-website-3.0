"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { fetchPublishedEvents } from "@/services/eventService";
import { formatDateParts } from "@/utils/dateUtils";
import "@/styles/events.css";

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

const ALL_TAGS = ["All", "Hackathon", "Workshop", "Talk", "Seminar", "Competition", "Webinar"];



export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function load() {
      const { data } = await fetchPublishedEvents();
      setEvents(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered =
    activeFilter === "All"
      ? events
      : events.filter((e) => e.tag.toLowerCase() === activeFilter.toLowerCase());

  const featured = events.length > 0 ? events[0] : null;

  return (
    <div className="events-page">
      <Header />

      {/* Hero */}
      <section className="events-hero">
        <div className="events-hero-content">
          <div className="events-breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span>Events</span>
          </div>
          <h1 className="events-page-title">
            UPCOMING <span>EVENTS.</span>
          </h1>
          <p className="events-page-subtitle">
            Workshops, hackathons, tech talks, and more — explore what&apos;s happening at IEEE CS
            SBC GECI this season.
          </p>
        </div>
      </section>

      {/* Filter Chips */}
      <div className="events-filter-bar">
        {ALL_TAGS.map((f) => (
          <button
            key={f}
            className={`filter-chip${activeFilter === f ? " active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Featured Event */}
      {featured && (
        <div className="events-featured">
          <div className="events-featured-content">
            <span className="events-featured-label">Featured Event</span>
            <h2 className="events-featured-title">{featured.title.split("—")[0].trim().toUpperCase()}</h2>
            <p className="events-featured-desc">{featured.description}</p>
          </div>
          {featured.registration_link ? (
            <a href={featured.registration_link} target="_blank" rel="noopener noreferrer" className="events-featured-cta">
              Register Now →
            </a>
          ) : (
            <span className="events-featured-cta" style={{ opacity: 0.5, cursor: 'default' }}>
              Registration Coming Soon
            </span>
          )}
        </div>
      )}

      {/* Section Label */}
      <div className="events-section-label">All Events · 2025–26</div>

      {/* Events Grid */}
      <div className="events-grid">
        {loading ? (
          <div className="events-loading">Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="events-empty">No events found for this category.</div>
        ) : (
          filtered.map((event, i) => {
            const { day, month } = formatDateParts(event.event_date);
            return (
              <div key={event.id} className="event-card">
                {event.cover_image_url && (
                  <div className="event-card-cover">
                    <img src={event.cover_image_url} alt={event.title} />
                  </div>
                )}
                <div className="event-card-header">
                  <div className="event-date">
                    <span className="event-date-day">{day}</span>
                    <span className="event-date-month">{month}</span>
                  </div>
                  <span className={`event-tag ${event.tag}`}>{event.tag}</span>
                </div>

                <h3 className="event-card-title">{event.title}</h3>
                <p className="event-card-desc">{event.description}</p>

                <div className="event-card-actions">
                  {event.registration_link && (
                    <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="event-action-link register-link">
                      <ExternalLinkIcon /> Register
                    </a>
                  )}
                  {event.document_url && (
                    <a href={event.document_url} target="_blank" rel="noopener noreferrer" className="event-action-link download-link">
                      <DownloadIcon /> Resources
                    </a>
                  )}
                </div>

                <div className="event-card-footer">
                  <div className="event-meta">
                    <span className="event-meta-item">
                      <MapPinIcon />
                      {event.location}
                    </span>
                    <span className="event-meta-item">
                      <ClockIcon />
                      {event.time_string}
                    </span>
                  </div>
                  <span className="event-card-arrow">→</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="events-footer">
        <p className="events-footer-text">
          Want to propose an event?{" "}
          <Link href="/login">Sign in as a member to submit a request →</Link>
        </p>
      </div>
    </div>
  );
}
