import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PT_SERVICES } from "@/lib/marketing";

export default function PersonalTrainingSection() {
  return (
    <section className="bg-[var(--color-bg)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-sm text-[var(--color-blaze)] mb-2">Personal training</p>
            <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-4xl text-[var(--color-text)] max-w-lg text-balance">
              One-on-one, when you want faster results
            </h2>
          </div>
          <Link href="/personal-training" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center gap-1">
            All PT services <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PT_SERVICES.slice(0, 3).map((s) => (
            <div key={s.name} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h3 className="font-medium text-[var(--color-text)]">{s.name}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">{s.desc}</p>
              <p className="mt-4 text-sm font-semibold text-[var(--color-brass)]">{s.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
