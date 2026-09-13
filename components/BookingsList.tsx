"use client";

import { useState, useTransition } from "react";
import { CalendarX2, Dumbbell } from "lucide-react";
import type { UpcomingBooking } from "@/lib/dashboard";

export default function BookingsList({
  initialUpcoming,
  history,
}: {
  initialUpcoming: UpcomingBooking[];
  history: UpcomingBooking[];
}) {
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const [upcoming, setUpcoming] = useState(initialUpcoming);
  const [isPending, startTransition] = useTransition();

  function cancel(id: string) {
    const prior = upcoming;
    setUpcoming((rows) => rows.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)));

    startTransition(async () => {
      const res = await fetch(`/api/bookings/${id}`, { method: "PATCH" });
      if (!res.ok) setUpcoming(prior); // roll back on failure
    });
  }

  const rows = tab === "upcoming" ? upcoming : history;

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(["upcoming", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm border transition-colors capitalize ${
              tab === t
                ? "bg-[var(--color-blaze)] border-[var(--color-blaze)] text-white"
                : "border-[var(--color-border)] text-[var(--color-text-muted)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-px bg-[var(--color-border)] rounded-md overflow-hidden">
        {rows.map((b) => (
          <div key={b.id} className="bg-[var(--color-surface)] px-5 py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex items-center gap-3 min-w-0">
              <Dumbbell size={16} className={`shrink-0 ${b.status === "cancelled" ? "text-[var(--color-text-faint)]" : b.status === "waitlisted" ? "text-[var(--color-warn)]" : "text-[var(--color-blaze)]"}`} />
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${b.status === "cancelled" ? "text-[var(--color-text-faint)] line-through" : "text-[var(--color-text)]"}`}>
                  {b.className}
                </p>
                <p className="text-xs text-[var(--color-text-faint)] truncate">
                  {b.category} · {b.trainer}
                  {b.status === "waitlisted" && <span className="text-[var(--color-warn)]"> · Waitlisted</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <p className="text-sm text-[var(--color-text-muted)]">{b.date} · {b.time}</p>
              {tab === "upcoming" && (b.status === "confirmed" || b.status === "waitlisted") && (
                <button
                  onClick={() => cancel(b.id)}
                  disabled={isPending}
                  aria-label="Cancel booking"
                  className="text-[var(--color-text-faint)] hover:text-[var(--color-danger)] transition-colors disabled:opacity-50"
                >
                  <CalendarX2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="bg-[var(--color-surface)] px-5 py-10 text-center text-sm text-[var(--color-text-faint)]">
            Nothing here yet — head to the schedule to book a class.
          </div>
        )}
      </div>
    </div>
  );
}
