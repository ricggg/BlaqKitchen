import { Target, Users, Dumbbell } from "lucide-react";
import PageHeader from "@/components/marketing/PageHeader";
import FinalCTA from "@/components/marketing/FinalCTA";

const VALUES = [
  { icon: Target, title: "Real programming", desc: "No generic classes — every session is coached with a purpose and progression plan." },
  { icon: Users, title: "A club, not a gym chain", desc: "We know our members by name. Small enough to care, serious enough to get results." },
  { icon: Dumbbell, title: "Training + food, together", desc: "Blags Kitchen exists because fitness doesn't end when the workout does." },
];

export default function AboutPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      <PageHeader
        eyebrow="About us"
        title="Asaba's strength, food & fitness club"
        description="Blag GYM started with a simple idea: training and nutrition should live under one roof, coached by people who actually know your name."
      />

      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-20 grid sm:grid-cols-3 gap-4">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <v.icon size={22} className="text-[var(--color-blaze)]" />
            <h3 className="mt-4 font-medium text-[var(--color-text)]">{v.title}</h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-20 text-center">
          <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl text-[var(--color-text)] mb-4">
            Along Rehoboth City Road, Church Street, Asaba
          </h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed max-w-lg mx-auto">
            Open daily from 5:00 AM to 11:00 PM. Certified coaches on the floor
            at every session, and Blags Kitchen serving right through the day.
          </p>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
