"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fetchPublishedEvents } from "@/services/eventService";
import { formatDate } from "@/utils/dateUtils";



export default function FeaturedEvents() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function load() {
      const { data } = await fetchPublishedEvents(3);
      setEvents(data ?? []);
    }
    load();
  }, []);

  return (
    <section
      className={`events-section ${isVisible ? "visible" : ""}`}
      id="featured-events"
      ref={sectionRef}
    >
      <div className="events-header">
        <span className="section-tag">FEATURED EVENTS</span>
        <h2 className="events-title">What&rsquo;s Coming Up</h2>
        <p className="events-subtitle">
          From hackathons to hands-on workshops — there&rsquo;s always something
          exciting happening at IEEE CS GECI.
        </p>
      </div>

      <div className="events-grid">
        {events.length === 0 ? (
          <article className="event-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <p className="event-card-desc" style={{ padding: '20px 0' }}>No upcoming events right now. Check back soon!</p>
          </article>
        ) : (
          events.map((event, i) => (
            <article
              className="event-card"
              key={event.id}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="event-card-top">
                <span className="event-tag">{event.tag?.toUpperCase()}</span>
                <span className="event-status">upcoming</span>
              </div>
              <h3 className="event-card-title">{event.title}</h3>
              <time className="event-card-date">{formatDate(event.event_date)}</time>
              <p className="event-card-desc">{event.description}</p>
              <div className="event-card-cta">
                <span className="event-card-link">
                  Learn more <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="events-view-all">
        <Link href="/events" className="view-all-btn" id="view-all-events-btn">
          View All Events <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
