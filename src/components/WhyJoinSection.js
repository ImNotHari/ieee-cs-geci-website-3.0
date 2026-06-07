"use client";

import { useEffect, useRef, useState } from "react";

const reasons = [
  {
    title: "Hands-On Workshops",
    description:
      "Go beyond textbooks with practical, project-based sessions on cutting-edge technologies like AI/ML, Web3, and cloud computing.",
  },
  {
    title: "National Competitions",
    description:
      "Represent GECI on a national stage. We regularly participate in and host hackathons, coding contests, and paper presentations.",
  },
  {
    title: "Industry Networking",
    description:
      "Connect with IEEE's global network of 400,000+ professionals, access exclusive resources, and get mentored by industry experts.",
  },
  {
    title: "Career Acceleration",
    description:
      "Build your portfolio with IEEE-certified projects, gain leadership experience, and access internship and placement opportunities.",
  },
  {
    title: "Research Opportunities",
    description:
      "Publish papers, attend conferences, and dive into collaborative research projects guided by faculty and industry mentors.",
  },
  {
    title: "Community & Culture",
    description:
      "Be part of a vibrant, inclusive tech community that celebrates curiosity, collaboration, and continuous learning.",
  },
];


export default function WhyJoinSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      className={`why-join-section ${isVisible ? "visible" : ""}`}
      id="why-join"
      ref={sectionRef}
    >
      <div className="why-join-header">
        <span className="section-tag">WHY JOIN US</span>
        <h2 className="why-join-title">More Than Just a Chapter</h2>
        <p className="why-join-subtitle">
          We&rsquo;re building the next generation of tech leaders. Here&rsquo;s
          what makes IEEE CS GECI different.
        </p>
      </div>

      <div className="why-join-grid">
        {reasons.map((reason, i) => (
          <div
            className="reason-card"
            key={reason.title}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <h3 className="reason-title">{reason.title}</h3>
            <p className="reason-desc">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
