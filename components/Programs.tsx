import { Dumbbell, Flame, HeartPulse, Users } from "lucide-react";
import Image from "next/image";
import LaneDivider from "./LaneDivider";

const PROGRAMS = [
  {
    icon: Dumbbell,
    name: "Strength & Powerlifting",
    desc: "Progressive overload programming with certified coaches watching every rep.",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?fm=jpg&q=70&w=800&auto=format&fit=crop",
  },
  {
    icon: Flame,
    name: "HIIT & Conditioning",
    desc: "45-minute high-intensity circuits built to torch fat and build engine.",
    image: "https://images.unsplash.com/photo-1545612036-2872840642dc?fm=jpg&q=70&w=800&auto=format&fit=crop",
  },
  {
    icon: Users,
    name: "Boxing & Combat Fit",
    desc: "Pad work, bag rounds and footwork drills for every skill level.",
    image: "https://images.unsplash.com/photo-1633394782368-6e7260566004?fm=jpg&q=70&w=800&auto=format&fit=crop",
  },
  {
    icon: HeartPulse,
    name: "Recovery & Mobility",
    desc: "Guided stretching, massage gun stations and sauna recovery sessions.",
    image: "https://images.unsplash.com/photo-1545612036-2872840642dc?fm=jpg&q=70&w=800&auto=format&fit=crop",
  },
];

export default function Programs() {
  return (
    <section id="programs" className="relative bg-[var(--color-surface)]">
      <LaneDivider />
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="text-sm text-[var(--color-blaze)] mb-2">Programs</p>
            <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-4xl text-[var(--color-text)] max-w-lg text-balance">
              Four ways to train, one membership
            </h2>
          </div>
          <a href="/schedule" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            View full schedule
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border)] rounded-md overflow-hidden">
          {PROGRAMS.map((p) => (
            <div key={p.name} className="bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] transition-colors">
              <div className="relative h-32 w-full overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] to-transparent" />
              </div>
              <div className="p-6 pt-4">
                <p.icon size={22} className="text-[var(--color-blaze)]" />
                <h3 className="mt-4 font-semibold text-[var(--color-text)]">{p.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
