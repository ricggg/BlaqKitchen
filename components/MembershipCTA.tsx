import Link from "next/link";
import { Check } from "lucide-react";
import LaneDivider from "./LaneDivider";
import { MEMBERSHIP_PLANS } from "@/lib/payments";

export default function MembershipCTA() {
  return (
    <section id="membership" className="relative bg-[var(--color-surface)]">
      <LaneDivider />
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
        <div className="mb-12 max-w-lg">
          <p className="text-sm text-[var(--color-blaze)] mb-2">Membership</p>
          <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-4xl text-[var(--color-text)] text-balance">
            Pick a plan, book your first class today
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {MEMBERSHIP_PLANS.map((p) => (
            <div
              key={p.name}
              className={`rounded-md p-7 border flex flex-col ${
                p.highlight
                  ? "border-[var(--color-blaze)] bg-[var(--gradient-card)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg)]"
              }`}
            >
              <p className="text-sm text-[var(--color-text-muted)]">{p.name}</p>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-text)]">
                  ₦{p.priceNaira.toLocaleString()}
                </span>
                <span className="text-sm text-[var(--color-text-faint)]">{p.period}</span>
              </p>
              <ul className="mt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <Check size={16} className="text-[var(--color-blaze)] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/membership"
                className={`mt-8 inline-flex justify-center rounded-sm px-5 py-3 text-sm font-semibold transition-colors ${
                  p.highlight
                    ? "bg-[var(--color-blaze)] text-white hover:bg-[var(--color-blaze-dark)]"
                    : "border border-[var(--color-border-strong)] text-[var(--color-text)] hover:border-[var(--color-blaze)]"
                }`}
              >
                Choose plan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
