"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 120, suffix: "+", label: "Active Members" },
  { value: 45, suffix: "+", label: "Events Conducted" },
  { value: 12, suffix: "", label: "Awards & Recognitions" },
  { value: 8, suffix: "+", label: "Industry Partners" },
];

function AnimatedCounter({ target, suffix, isVisible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <span className="stat-value">
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
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
      className={`stats-section ${isVisible ? "visible" : ""}`}
      id="stats-section"
      ref={sectionRef}
    >
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div
            className="stat-card"
            key={stat.label}
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            <AnimatedCounter
              target={stat.value}
              suffix={stat.suffix}
              isVisible={isVisible}
            />
            <span className="stat-label">{stat.label}</span>
            <div className="stat-glow" aria-hidden="true"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
