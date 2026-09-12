"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, User2 } from "lucide-react";
import BookingModal from "@/components/BookingModal";
import { CATEGORY_LABEL, DAY_LABEL, type ClassCategory, type GymClass } from "@/lib/classes";
import { fetchClasses } from "@/lib/data/classes";

const FILTERS: ("all" | ClassCategory)[] = ["all", "strength", "hiit", "boxing", "recovery"];

export default function SchedulePage() {
  const [filter, setFilter] = useState<"all" | ClassCategory>("all");
  const [selected, setSelected] = useState<GymClass | null>(null);
  const [allClasses, setAllClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses()
      .then(setAllClasses)
      .finally(() => setLoading(false));
  }, []);

  const classes = useMemo(() => {
    const sorted = [...allClasses].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
    return filter === "all" ? sorted : sorted.filter((c) => c.category === filter);
  }, [filter, allClasses]);

  return (
    <section className="min-h-[100svh] bg-[var(--color-bg)] pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <p className="text-sm text-[var(--color-blaze)] mb-2">Schedule</p>
        <h1 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-4xl text-[var(--color-text)] mb-8">
          This week&rsquo;s classes
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                filter === f
                  ? "bg-[var(--color-blaze)] border-[var(--color-blaze)] text-white"
                  : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]"
              }`}
            >
              {f === "all" ? "All classes" : CATEGORY_LABEL[f]}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-sm text-[var(--color-text-faint)] mb-4">Loading schedule…</p>
        )}
        {!loading && classes.length === 0 && (
          <p className="text-sm text-[var(--color-text-faint)] mb-4">No classes match this filter.</p>
        )}

        <div className="flex flex-col gap-3">
          {classes.map((c, i) => {
            const spotsLeft = c.capacity - c.booked;
            const nearlyFull = spotsLeft <= 3 && spotsLeft > 0;
            return (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                onClick={() => setSelected(c)}
                className="text-left rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition-colors p-5 flex flex-wrap items-center gap-4 justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 text-center shrink-0">
                    <p className="text-xs text-[var(--color-text-faint)]">{DAY_LABEL[c.dayOfWeek]}</p>
                    <p className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text)]">
                      {c.startTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-blaze)]">{CATEGORY_LABEL[c.category]}</p>
                    <p className="font-medium text-[var(--color-text)]">{c.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1"><User2 size={12} />{c.trainer}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{c.durationMinutes} min</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-xs font-medium ${
                      spotsLeft === 0
                        ? "text-[var(--color-danger)]"
                        : nearlyFull
                        ? "text-[var(--color-warn)]"
                        : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {spotsLeft === 0 ? "Full" : `${spotsLeft} spots left`}
                  </p>
                  <span className="mt-2 inline-block rounded-sm bg-[var(--color-blaze)]/10 text-[var(--color-blaze)] px-3 py-1.5 text-xs font-semibold">
                    Book
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {selected && <BookingModal gymClass={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
