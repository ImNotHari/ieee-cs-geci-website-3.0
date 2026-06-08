"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "Events", href: "/events" },
  { label: "Achievements", href: "/achievements" },
  { label: "Execom", href: "/execom" },
  { label: "Explore", href: "/explore" },
  { label: "Useful Links", href: "/useful-links" },
  { label: "Blog", href: "/blog" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="header" id="header">
        <Link href="/" className="header-logo" id="logo-link">
          <img
            src="/assets/ieee-logo-geci.png"
            alt="IEEE Computer Society GECI Logo"
            style={{ height: "75px", width: "auto", display: "block", mixBlendMode: "screen" }}
          />
        </Link>

        <nav className="header-nav">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="header-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className={`header-menu-btn ${isMenuOpen ? "active" : ""}`}
          id="menu-btn"
          aria-label="Open navigation menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Backdrop overlay for closing menu */}
      <div 
        className={`menu-backdrop ${isMenuOpen ? "open" : ""}`} 
        onClick={() => setIsMenuOpen(false)} 
        aria-hidden="true" 
      />

      {/* Side Menu */}
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="side-menu-content">
          <nav className="mobile-nav">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <Link href="/login" className="member-login-btn" onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
