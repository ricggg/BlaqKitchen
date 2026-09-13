import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import LaneDivider from "@/components/LaneDivider";
import { TRANSFORMATIONS } from "@/lib/marketing";

export default function TransformationsSection({ showAllLink = true }: { showAllLink?: boolean }) {
  return (
    <section className="relative bg-[var(--color-bg)]">
      <LaneDivider />
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-sm text-[var(--color-blaze)] mb-2">Real results</p>
            <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-4xl text-[var(--color-text)] max-w-lg text-balance">
              Transformation stories
            </h2>
          </div>
          {showAllLink && (
            <Link href="/transformations" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center gap-1">
              More stories <ArrowRight size={14} />
            </Link>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {TRANSFORMATIONS.map((t) => (
            <div key={t.name} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
              <div className="relative h-64 w-full">
                <Image src={t.image} alt={t.name} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <p className="font-medium text-[var(--color-text)]">{t.name}</p>
                <p className="text-xs text-[var(--color-text-faint)] mt-0.5">{t.duration} at Blag GYM</p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">{t.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
