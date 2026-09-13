import { CalendarCheck2, Dumbbell, TrendingUp, Bot } from "lucide-react";
import LaneDivider from "@/components/LaneDivider";

const FEATURES = [
  { icon: CalendarCheck2, label: "Book classes in seconds" },
  { icon: Dumbbell, label: "Log every workout & PR" },
  { icon: TrendingUp, label: "Track progress over time" },
  { icon: Bot, label: "Ask your AI coach anything" },
];

export default function AppPlatformSection() {
  return (
    <section className="relative bg-[var(--color-bg)]">
      <LaneDivider accent="var(--color-brass)" />
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm text-[var(--color-brass)] mb-2">Member platform</p>
          <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-4xl text-[var(--color-text)] max-w-md text-balance">
            Your whole membership, in one dashboard
          </h2>
          <p className="mt-4 max-w-md text-[var(--color-text-muted)] leading-relaxed">
            Bookings, workouts, progress, rewards and Blags Kitchen orders —
            everything lives in your member dashboard, on the web or your
            phone. No separate apps to juggle.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div key={f.label} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <f.icon size={20} className="text-[var(--color-brass)]" />
              <p className="mt-4 text-sm font-medium text-[var(--color-text)]">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
