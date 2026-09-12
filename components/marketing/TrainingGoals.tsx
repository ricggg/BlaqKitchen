import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TRAINING_GOALS } from "@/lib/marketing";

export default function TrainingGoals() {
  return (
    <section className="bg-[var(--color-bg)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
        <p className="text-sm text-[var(--color-blaze)] mb-2">What&rsquo;s your goal</p>
        <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-4xl text-[var(--color-text)] max-w-lg text-balance mb-12">
          Train toward something specific
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRAINING_GOALS.map((g) => (
            <Link
              key={g.name}
              href={g.href}
              className="group rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-blaze)] transition-colors flex flex-col"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-[var(--color-text)]">{g.name}</h3>
                <ArrowUpRight size={16} className="text-[var(--color-text-faint)] group-hover:text-[var(--color-blaze)] transition-colors shrink-0" />
              </div>
              <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">{g.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
