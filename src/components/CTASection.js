"use client";

import { useEffect, useRef, useState } from "react";

export default function CTASection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`cta-section ${isVisible ? "visible" : ""}`}
      id="cta-section"
      ref={sectionRef}
    >
      <div className="cta-glow-orb cta-glow-1" aria-hidden="true"></div>
      <div className="cta-glow-orb cta-glow-2" aria-hidden="true"></div>

      <div className="cta-content">
        <h2 className="cta-title">
          Ready to Build the Future<span className="cta-dot">?</span>
        </h2>
        <p className="cta-text">
          Join IEEE Computer Society GECI and be part of a movement that turns
          students into innovators, thinkers into builders, and ideas into
          impact.
        </p>
        <div className="cta-buttons">
          <a href="#" className="cta-btn cta-btn-primary" id="cta-join-btn">
            Become a Member
          </a>
          <a href="#" className="cta-btn cta-btn-secondary" id="cta-contact-btn">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
