import Link from "next/link";
import { ArrowRight, Clock, User2 } from "lucide-react";
import LaneDivider from "@/components/LaneDivider";
import { DEMO_CLASSES, CATEGORY_LABEL, DAY_LABEL } from "@/lib/classes";

export default function SchedulePreview() {
  const upcoming = [...DEMO_CLASSES]
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
    .slice(0, 4);

  return (
    <section className="relative bg-[var(--color-surface)]">
      <LaneDivider />
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-sm text-[var(--color-blaze)] mb-2">Live schedule</p>
            <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-4xl text-[var(--color-text)] max-w-lg text-balance">
              What&rsquo;s coming up this week
            </h2>
          </div>
          <Link href="/schedule" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center gap-1">
            View full schedule <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex flex-col gap-px bg-[var(--color-border)] rounded-md overflow-hidden">
          {upcoming.map((c) => {
            const spotsLeft = c.capacity - c.booked;
            return (
              <div key={c.id} className="bg-[var(--color-bg)] px-5 py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <div className="flex items-center gap-4">
                  <div className="w-14 text-center shrink-0">
                    <p className="text-xs text-[var(--color-text-faint)]">{DAY_LABEL[c.dayOfWeek]}</p>
                    <p className="font-[family-name:var(--font-display)] text-base text-[var(--color-text)]">{c.startTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-blaze)]">{CATEGORY_LABEL[c.category]}</p>
                    <p className="font-medium text-[var(--color-text)]">{c.name}</p>
                    <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] mt-0.5">
                      <User2 size={12} />{c.trainer}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] shrink-0">
                  {spotsLeft === 0 ? "Full" : `${spotsLeft} spots left`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
