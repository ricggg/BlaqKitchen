import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="bg-[var(--color-bg)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
        <div className="rounded-md border border-[var(--color-border-strong)] bg-[var(--gradient-card)] p-10 sm:p-14 text-center">
          <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-5xl text-[var(--color-text)] text-balance max-w-2xl mx-auto">
            Your first session is waiting
          </h2>
          <p className="mt-4 max-w-md mx-auto text-[var(--color-text-muted)] leading-relaxed">
            Pick a class, meet a coach, and see why 1,200+ members train at Blaq GYM.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/schedule"
              className="group inline-flex items-center gap-2 rounded-sm bg-[var(--color-blaze)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--color-blaze-dark)] transition-colors"
            >
              Book your first session
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/membership" className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-brass)] transition-colors">
              See membership plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
