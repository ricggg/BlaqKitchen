import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FACILITIES } from "@/lib/marketing";

export default function FacilitiesSection({ showAllLink = true }: { showAllLink?: boolean }) {
  return (
    <section className="bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-sm text-[var(--color-blaze)] mb-2">The club</p>
            <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-4xl text-[var(--color-text)] max-w-lg text-balance">
              Built for serious training
            </h2>
          </div>
          {showAllLink && (
            <Link href="/facilities" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center gap-1">
              Full tour <ArrowRight size={14} />
            </Link>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FACILITIES.map((f) => (
            <div key={f.name} className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden">
              <div className="relative h-40 w-full">
                <Image src={f.image} alt={f.name} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="font-medium text-[var(--color-text)]">{f.name}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
