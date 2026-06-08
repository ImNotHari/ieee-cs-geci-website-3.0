"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCurrentMember, signOut } from "@/services/authService";

// ── Icons ──────────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const PlusCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: member, isLoading } = useQuery({
    queryKey: ["currentMember"],
    queryFn: getCurrentMember,
    staleTime: 5 * 60 * 1000,
  });

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <aside className="member-sidebar">
        <div className="sidebar-logo">
          <img src="/assets/ieee-logo-geci.png" alt="IEEE CS GECI" />
          <p className="sidebar-label">Member</p>
        </div>
        <nav className="sidebar-nav">
          <span className="sidebar-link active">
            <span className="icon" style={{ display: "flex" }}><DashboardIcon /></span> Loading...
          </span>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="member-sidebar">
      <div className="sidebar-logo">
        <img src="/assets/ieee-logo-geci.png" alt="IEEE CS GECI" />
        <p className="sidebar-label">Member</p>
      </div>

      <nav className="sidebar-nav">
        <Link href="/member/dashboard" className={`sidebar-link ${pathname === '/member/dashboard' ? 'active' : ''}`}>
          <span className="icon" style={{ display: "flex" }}><DashboardIcon /></span> Dashboard
        </Link>
        <Link href="/member/propose" className={`sidebar-link ${pathname === '/member/propose' ? 'active' : ''}`}>
          <span className="icon" style={{ display: "flex" }}><PlusCircleIcon /></span> Propose Event
        </Link>
        <Link href="/" className="sidebar-link">
          <span className="icon" style={{ display: "flex" }}><HomeIcon /></span> Back to Site
        </Link>

      </nav>

      <div className="sidebar-footer">
        {member && (
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "12px" }}>
            Signed in as<br />
            <span style={{ color: "var(--text-gray)", fontWeight: 500 }}>
              {member.full_name || member.email}
            </span>
          </p>
        )}
        <button className="sidebar-signout" onClick={handleSignOut}>
          <span style={{ display: "flex" }}><LogOutIcon /></span> Sign Out
        </button>
      </div>
    </aside>
  );
}
