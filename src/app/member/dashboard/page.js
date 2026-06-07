"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCurrentMember } from "@/services/authService";
import { fetchMemberEvents } from "@/services/eventService";
import { formatDate } from "@/utils/dateUtils";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import Badge from "@/components/ui/Badge";
import StatBox from "@/components/ui/StatBox";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import EventTimeline from "@/components/EventTimeline";

// ── Icons ──────────────────────────────────────────────────
const PlusCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
const UserLargeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const FileTextIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default function MemberDashboardPage() {
  const router = useRouter();

  // ── Auth ────────────────────────────────────────────────
  const {
    data: member,
    isLoading: memberLoading,
    isError: memberError,
    refetch: refetchMember,
  } = useQuery({
    queryKey: ["currentMember"],
    queryFn: getCurrentMember,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (!memberLoading && !member) {
      router.push("/login");
    }
  }, [member, memberLoading, router]);

  // ── Events ──────────────────────────────────────────────
  const {
    data: eventsResult,
    isLoading: eventsLoading,
    isError: eventsError,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ["memberEvents", member?.id],
    queryFn: () => fetchMemberEvents(member.id),
    enabled: !!member?.id,
    staleTime: 60 * 1000,
  });

  // ── Real-Time ───────────────────────────────────────────
  useRealtimeEvents(member?.id);

  const events = eventsResult?.data ?? [];

  const stats = {
    total: events.length,
    published: events.filter((e) => e.status === "published" || e.status === "approved").length,
    pending: events.filter((e) => e.status === "pending" || e.status === "submitted" || e.status === "under_review" || e.status === "draft").length,
  };

  const roleBadgeClass = (role) =>
    ({ admin: "role-admin", execom: "role-execom", member: "role-member" }[role] ?? "role-member");

  // ── Error State ──────────────────────────────────────────
  if (memberError) {
    return (
      <main className="member-main">
        <div className="member-topbar">
          <h1 className="member-topbar-title">MY DASHBOARD</h1>
        </div>
        <div className="member-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <EmptyState
            icon={<AlertIcon />}
            title="Something Went Wrong"
            text="We couldn't load your profile. Please try again."
            action={
              <button className="member-action-btn primary" onClick={() => refetchMember()}>
                Retry
              </button>
            }
          />
        </div>
      </main>
    );
  }

  // ── Skeleton Loading State ────────────────────────────────
  if (memberLoading) {
    return (
      <main className="member-main">
        <div className="member-topbar">
          <h1 className="member-topbar-title">MY DASHBOARD</h1>
        </div>
        <div className="member-content">
          <div className="skeleton skeleton-profile" />
          <div className="skeleton-stats">
            <div className="skeleton skeleton-stat" />
            <div className="skeleton skeleton-stat" />
            <div className="skeleton skeleton-stat" />
          </div>
          <div className="skeleton skeleton-table" />
        </div>
      </main>
    );
  }

  if (!member) return null;

  // ── Render ────────────────────────────────────────────────
  return (
    <main className="member-main">
      <div className="member-topbar">
        <h1 className="member-topbar-title">MY DASHBOARD</h1>
        <div className="member-topbar-right">
          <Badge variant={member.role} />
        </div>
      </div>

      <div className="member-content">
        {/* Profile Card */}
        <Card style={{ display: "flex", alignItems: "center", gap: "28px", marginBottom: "28px" }}>
          <div className="member-avatar">
            <UserLargeIcon />
          </div>
          <div className="member-profile-info">
            <h2 className="member-profile-name">{member.full_name || "—"}</h2>
            <p className="member-profile-email">{member.email}</p>
            <div className="member-profile-details">
              <div className="member-detail-item">
                <span className="member-detail-label">IEEE ID</span>
                <span className="member-detail-value">{member.ieee_member_id || "—"}</span>
              </div>
              <div className="member-detail-item">
                <span className="member-detail-label">Department</span>
                <span className="member-detail-value">{member.department || "—"}</span>
              </div>
              <div className="member-detail-item">
                <span className="member-detail-label">Year</span>
                <span className="member-detail-value">{member.year || "—"}</span>
              </div>
              <div className="member-detail-item">
                <span className="member-detail-label">Role</span>
                <span className="member-detail-value" style={{ textTransform: "capitalize" }}>{member.role}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="member-stats">
          <StatBox
            icon={<CalendarIcon />}
            value={eventsLoading ? "—" : stats.total}
            label="Total Proposed"
            variant="total"
            delay={0.08}
          />
          <StatBox
            icon={<CheckCircleIcon />}
            value={eventsLoading ? "—" : stats.published}
            label="Published"
            variant="published"
            delay={0.16}
          />
          <StatBox
            icon={<ClockIcon />}
            value={eventsLoading ? "—" : stats.pending}
            label="Pending Review"
            variant="pending"
            delay={0.24}
          />
        </div>

        {/* My Events */}
        <div className="member-events-section">
          <div className="member-section-header">
            <h2 className="member-section-title">MY EVENTS</h2>
            <div className="member-quick-actions">
              <Link href="/member/propose" className="member-action-btn primary">
                <PlusCircleIcon /> Propose New Event
              </Link>
            </div>
          </div>

          {/* Error State for Events */}
          {eventsError ? (
            <Card style={{ marginBottom: "20px" }}>
              <EmptyState
                icon={<AlertIcon />}
                title="Couldn't Load Events"
                text="Something went wrong fetching your events."
                action={
                  <button className="member-action-btn primary" onClick={() => refetchEvents()}>
                    Retry
                  </button>
                }
              />
            </Card>
          ) : (
            <div className="member-table-wrapper">
              <table className="member-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Workflow</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {eventsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={`skeleton-${i}`}>
                        <td><div className="skeleton" style={{ height: "16px", width: "80%" }} /></td>
                        <td><div className="skeleton" style={{ height: "16px", width: "60px" }} /></td>
                        <td><div className="skeleton" style={{ height: "16px", width: "70px" }} /></td>
                        <td><div className="skeleton" style={{ height: "16px", width: "60px" }} /></td>
                        <td><div className="skeleton" style={{ height: "16px", width: "150px" }} /></td>
                        <td><div className="skeleton" style={{ height: "16px", width: "70px" }} /></td>
                      </tr>
                    ))
                  ) : events.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <EmptyState
                          icon={<FileTextIcon />}
                          title="No Events Yet"
                          text="You haven't proposed any events yet. Start by submitting your first idea!"
                          action={
                            <Link href="/member/propose" className="member-action-btn primary">
                              <PlusCircleIcon /> Propose an Event
                            </Link>
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    events.map((event) => (
                      <tr key={event.id}>
                        <td style={{ fontWeight: 500, color: "var(--text-white)" }}>{event.title}</td>
                        <td><Badge variant={event.tag || "default"} label={event.tag} /></td>
                        <td>{event.event_date ? formatDate(event.event_date) : "—"}</td>
                        <td><Badge variant={event.status} /></td>
                        <td><EventTimeline status={event.status} /></td>
                        <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                          {event.created_at ? formatDate(event.created_at) : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!eventsLoading && !eventsError && events.length > 0 && (
            <div style={{ padding: "12px 16px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Showing {events.length} event{events.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
