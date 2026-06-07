"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/supabase";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { member, error: authError } = await signIn(email, password);

    setLoading(false);

    if (authError) {
      setError(authError.message || "Invalid credentials. Please try again.");
      return;
    }

    // Role-based redirect
    if (member?.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="login-container">
      {/* Back to Home Button */}
      <Link href="/" className="login-back-btn">
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      {/* Decorative Glow */}
      <div className="login-glow"></div>

      <div className="login-card">
        <Link href="/" className="login-logo" style={{ display: 'block' }}>
          <img
            src="/assets/ieee-logo-geci.png"
            alt="IEEE CS GECI"
            style={{ height: "80px", width: "auto", mixBlendMode: "screen" }}
          />
        </Link>

        <h1 className="login-title">WELCOME BACK</h1>
        <p className="login-subtitle">Sign in to your IEEE member dashboard</p>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="member@ieee.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" className="remember-checkbox" />
              <span className="remember-label">Remember me</span>
            </label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="login-btn"
            id="login-submit-btn"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          All member IDs are configured by the admin. Please contact support.
        </div>
      </div>
    </div>
  );
}
