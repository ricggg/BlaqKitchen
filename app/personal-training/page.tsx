import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/marketing/PageHeader";
import FinalCTA from "@/components/marketing/FinalCTA";
import { PT_SERVICES } from "@/lib/marketing";

export default function PersonalTrainingPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      <PageHeader
        eyebrow="Personal training"
        title="One-on-one, when you want faster results"
        description="Book a trainer for focused, private sessions built entirely around your goal."
      />

      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PT_SERVICES.map((s) => (
            <div key={s.name} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex flex-col">
              <h3 className="font-medium text-[var(--color-text)]">{s.name}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed flex-1">{s.desc}</p>
              <p className="mt-4 text-sm font-semibold text-[var(--color-brass)]">{s.price}</p>
              <Link
                href="/schedule"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-blaze)] transition-colors"
              >
                Book a trainer <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs text-[var(--color-text-faint)] text-center">
          Trainer availability and direct PT booking land in Batch 10 — for now, mention your preferred service and trainer when you book a session.
        </p>
      </section>

      <FinalCTA />
    </div>
  );
}
