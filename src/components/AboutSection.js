"use client";

import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`about-section ${isVisible ? "visible" : ""}`}
      id="about-section"
      ref={sectionRef}
    >
      <div className="about-grid">
        <div className="about-label">
          <span className="section-tag">WHO WE ARE</span>
        </div>
        <div className="about-content">
          <h2 className="about-title">
            A community of builders, thinkers &amp; innovators pushing the
            boundaries of computing.
          </h2>
          <p className="about-text">
            IEEE Computer Society Student Branch Chapter at Government
            Engineering College Idukki is a vibrant hub for aspiring
            technologists. We bridge the gap between academic theory and
            industry-level practice through hands-on workshops, hackathons,
            research discussions, and peer-led knowledge exchanges.
          </p>
          <p className="about-text">
            Our mission is simple — equip every member with the technical
            fluency, collaborative mindset, and leadership skills needed to
            create meaningful impact in the world of technology.
          </p>
        </div>
      </div>

      {/* Visual accent line */}
      <div className="about-accent-line" aria-hidden="true"></div>
    </section>
  );
}
