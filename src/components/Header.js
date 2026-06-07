"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="header" id="header">
        <Link href="/" className="header-logo" id="logo-link">
          <img
            src="/assets/ieee-logo-geci.png"
            alt="IEEE Computer Society GECI Logo"
            style={{ height: "100px", width: "auto", display: "block", mixBlendMode: "screen" }}
          />
        </Link>

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

      {/* Side Menu */}
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="side-menu-content">
          <Link href="/login" className="member-login-btn">
            Member Login
          </Link>
        </div>
      </div>
    </>
  );
}
