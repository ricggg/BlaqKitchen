import { ShieldCheck, Users, Dumbbell, Clock } from "lucide-react";

const ITEMS = [
  { icon: Users, label: "1,200+ active members" },
  { icon: Dumbbell, label: "40+ classes weekly" },
  { icon: ShieldCheck, label: "Certified coaches only" },
  { icon: Clock, label: "Open 05:00–23:00 daily" },
];

export default function TrustStrip() {
  return (
    <section className="bg-[var(--color-bg)] border-y border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {ITEMS.map((it) => (
          <div key={it.label} className="flex items-center gap-3 min-w-0">
            <it.icon size={18} className="text-[var(--color-blaze)] shrink-0" />
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] truncate">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
