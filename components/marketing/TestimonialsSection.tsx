import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/marketing";

export default function TestimonialsSection() {
  return (
    <section className="bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
        <p className="text-sm text-[var(--color-blaze)] mb-2">Members say</p>
        <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-4xl text-[var(--color-text)] max-w-lg text-balance mb-12">
          Trusted by 1,200+ members
        </h2>

        <div className="grid sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-6 flex flex-col">
              <Quote size={20} className="text-[var(--color-blaze)]" />
              <p className="mt-4 text-sm text-[var(--color-text-muted)] leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
                <p className="text-sm font-medium text-[var(--color-text)]">{t.name}</p>
                <p className="text-xs text-[var(--color-text-faint)] mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
