"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MeetingsData {
  upcoming: Record<string, unknown>[];
  past: Record<string, unknown>[];
  blackoutDates: Record<string, unknown>[];
  hasCalendar: boolean;
  calendarBusy: { start: string; end: string }[];
  bookingUrl: string;
}

export function MeetingsView({ tenantSlug, data }: { tenantSlug: string; data: MeetingsData }) {
  const router = useRouter();
  const base = `/mission-control/${tenantSlug}`;
  const [showPto, setShowPto] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [addingLead, setAddingLead] = useState<number | null>(null);
  const [addedLeads, setAddedLeads] = useState<Set<number>>(new Set());

  async function handleAddLead(meeting: Record<string, unknown>) {
    const id = meeting.id as number;
    setAddingLead(id);
    try {
      const res = await fetch(`/api/mc/${tenantSlug}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: meeting.client_name || "",
          email: meeting.client_email || "",
          notes: `Added from meeting on ${new Date(meeting.start_time as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
        }),
      });
      if (res.ok) {
        setAddedLeads((prev) => new Set(prev).add(id));
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.error || "Failed to add lead");
      }
    } catch {
      alert("Failed to add lead");
    }
    setAddingLead(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this meeting?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/mc/${tenantSlug}/meetings`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      router.refresh();
    } catch {
      alert("Failed to delete meeting");
    }
    setDeleting(null);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: '#d4a574' }}>Meetings</h1>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, marginTop: 4 }}>
            {data.upcoming.length} upcoming meeting{data.upcoming.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowPto(!showPto)}
            style={{
              background: "rgba(232,223,207,0.05)", color: "rgba(232,223,207,0.5)",
              border: "none", borderRadius: 10, padding: "10px 16px",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              fontFamily: 'var(--font-body)',
            }}
          >
            {showPto ? "Hide PTO" : "Block Time (PTO)"}
          </button>
          <button
            onClick={() => router.push(`${base}/settings`)}
            style={{
              background: "rgba(232,223,207,0.05)", color: "rgba(232,223,207,0.5)",
              border: "none", borderRadius: 10, padding: "10px 16px",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              fontFamily: 'var(--font-body)',
            }}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Booking link + Calendar sync status */}
      <div style={{
        display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap",
      }}>
        <div style={{
          flex: 1, minWidth: 240, background: "#111827", border: "1px solid rgba(212,165,116,0.15)",
          borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{ fontSize: 22, opacity: 0.5 }}>🔗</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8dfcf", marginBottom: 2 }}>Booking Link</div>
            <div style={{ fontSize: 12, color: "rgba(232,223,207,0.4)" }}>{data.bookingUrl}</div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(data.bookingUrl.startsWith("http") ? data.bookingUrl : `${window.location.origin}${data.bookingUrl}`);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            style={{
              background: "#d4a574", color: "#0b1120", border: "none",
              borderRadius: 8, padding: "7px 14px", fontSize: 12,
              fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)",
            }}
          >
            {copiedLink ? "Copied" : "Copy Link"}
          </button>
        </div>

        <div style={{
          minWidth: 180, background: "#111827", border: `1px solid ${data.hasCalendar ? "rgba(34,197,94,0.15)" : "rgba(232,223,207,0.1)"}`,
          borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: data.hasCalendar ? "#22c55e" : "rgba(232,223,207,0.2)" }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: data.hasCalendar ? "#e8dfcf" : "rgba(232,223,207,0.5)" }}>
              Google Calendar
            </div>
            <div style={{ fontSize: 11, color: data.hasCalendar ? "#22c55e" : "rgba(232,223,207,0.3)" }}>
              {data.hasCalendar ? "Synced" : "Not connected"}
            </div>
          </div>
        </div>
      </div>

      {/* PTO Section */}
      {showPto && (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 12px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Blocked Time / PTO</h2>

          {data.blackoutDates.length === 0 ? (
            <p style={{ color: "rgba(232,223,207,0.25)", fontSize: 13, margin: 0 }}>No upcoming blocked time</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.blackoutDates.map((bd, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(232,223,207,0.03)" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(232,223,207,0.85)" }}>{bd.label as string || "Blocked"}</div>
                    <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>
                      {new Date(bd.start_date as string).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" - "}
                      {new Date(bd.end_date as string).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            style={{
              background: "rgba(212,165,116,0.1)", color: "#d4a574", border: "none",
              borderRadius: 8, padding: "8px 14px", fontSize: 13,
              fontWeight: 600, cursor: "pointer", marginTop: 12,
              fontFamily: 'var(--font-display)',
            }}
          >
            + Add Blocked Time
          </button>
        </div>
      )}

      {/* Upcoming meetings */}
      <div style={{
        background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
        borderRadius: 14, padding: "20px 24px", marginBottom: 20,
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Upcoming</h2>

        {data.upcoming.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 28, opacity: 0.3, marginBottom: 8 }}>◆</div>
            <p style={{ color: "rgba(232,223,207,0.25)", fontSize: 14, margin: "0 0 12px 0" }}>
              No upcoming meetings
            </p>
            <p style={{ color: "rgba(232,223,207,0.2)", fontSize: 13, margin: 0 }}>
              Meetings booked through your booking link will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.upcoming.map((m, i) => {
              const startDate = new Date(m.start_time as string);
              const endDate = new Date(m.end_time as string);
              const isToday = startDate.toDateString() === new Date().toDateString();
              const isTomorrow = startDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "14px 16px", borderRadius: 10,
                  border: `1px solid ${isToday ? "rgba(212,165,116,0.2)" : "rgba(232,223,207,0.1)"}`,
                  background: isToday ? "rgba(212,165,116,0.04)" : "transparent",
                }}>
                  {/* Date block */}
                  <div style={{ textAlign: "center", width: 48, flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: isToday ? "#d4a574" : "rgba(232,223,207,0.35)", fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                      {isToday ? "Today" : isTomorrow ? "Tomorrow" : startDate.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#e8dfcf", fontFamily: 'var(--font-display)' }}>
                      {startDate.getDate()}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(232,223,207,0.25)" }}>
                      {startDate.toLocaleDateString("en-US", { month: "short" })}
                    </div>
                  </div>

                  {/* Meeting info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf" }}>
                      {m.client_name as string}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>
                      {startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      {" - "}
                      {endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      {" · "}
                      {(m.booking_type as string || "").replace(/-/g, " ")}
                    </div>
                    {!!m.client_email && (
                      <div style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", marginTop: 2 }}>{String(m.client_email)}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {!!m.google_meet_url && (
                      <a href={m.google_meet_url as string} target="_blank" rel="noopener" style={{
                        background: "#22c55e", color: "#fff", borderRadius: 8,
                        padding: "6px 12px", fontSize: 12, fontWeight: 600,
                        textDecoration: "none",
                      }}>
                        Join
                      </a>
                    )}
                    {addedLeads.has(m.id as number) ? (
                      <span style={{ fontSize: 12, color: "#22c55e", padding: "6px 10px" }}>Added</span>
                    ) : (
                      <button
                        onClick={() => handleAddLead(m)}
                        disabled={addingLead === (m.id as number)}
                        style={{
                          background: "rgba(212,165,116,0.1)", color: "#d4a574", border: "none",
                          borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 500,
                          cursor: "pointer", opacity: addingLead === (m.id as number) ? 0.5 : 1,
                        }}
                      >
                        {addingLead === (m.id as number) ? "..." : "Add as Lead"}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(m.id as number)}
                      disabled={deleting === (m.id as number)}
                      style={{
                        background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none",
                        borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 500,
                        cursor: "pointer", opacity: deleting === (m.id as number) ? 0.5 : 1,
                      }}
                    >
                      {deleting === (m.id as number) ? "..." : "Cancel"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past meetings */}
      {data.past.length > 0 && (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px",
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px 0", color: "rgba(232,223,207,0.5)", fontFamily: 'var(--font-display)' }}>Recent</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {data.past.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < data.past.length - 1 ? "1px solid rgba(232,223,207,0.08)" : "none" }}>
                <div style={{ fontSize: 13, color: "rgba(232,223,207,0.5)", flex: 1 }}>{m.client_name as string}</div>
                <div style={{ fontSize: 12, color: "rgba(232,223,207,0.25)" }}>
                  {new Date(m.start_time as string).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
                {addedLeads.has(m.id as number) ? (
                  <span style={{ fontSize: 12, color: "#22c55e", padding: "4px 8px" }}>Added</span>
                ) : (
                  <button
                    onClick={() => handleAddLead(m)}
                    disabled={addingLead === (m.id as number)}
                    style={{
                      background: "none", color: "#d4a574", border: "none",
                      fontSize: 12, cursor: "pointer", padding: "4px 8px",
                      fontWeight: 500,
                      opacity: addingLead === (m.id as number) ? 0.5 : 1,
                    }}
                  >
                    {addingLead === (m.id as number) ? "..." : "Add as Lead"}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(m.id as number)}
                  disabled={deleting === (m.id as number)}
                  style={{
                    background: "none", color: "rgba(239,68,68,0.5)", border: "none",
                    fontSize: 12, cursor: "pointer", padding: "4px 8px",
                    opacity: deleting === (m.id as number) ? 0.5 : 1,
                  }}
                >
                  {deleting === (m.id as number) ? "..." : "Remove"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
