import Link from "next/link";
import Image from "next/image";
import { TRAINERS } from "@/lib/marketing";

export default function TrainersSection({ limit, showAllLink = true }: { limit?: number; showAllLink?: boolean }) {
  const list = limit ? TRAINERS.slice(0, limit) : TRAINERS;

  return (
    <section className="relative bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-sm text-[var(--color-blaze)] mb-2">Coaches</p>
            <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-4xl text-[var(--color-text)] max-w-lg text-balance">
              Meet the team
            </h2>
          </div>
          {showAllLink && (
            <Link href="/trainers" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              All trainers
            </Link>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {list.map((t) => (
            <div key={t.slug} className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden">
              <div className="relative h-56 w-full">
                <Image src={t.image} alt={t.name} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />
              </div>
              <div className="p-5">
                <p className="font-medium text-[var(--color-text)]">{t.name}</p>
                <p className="text-xs text-[var(--color-blaze)] mt-0.5">{t.specialty}</p>
                <p className="text-xs text-[var(--color-text-faint)] mt-2">{t.experience}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
