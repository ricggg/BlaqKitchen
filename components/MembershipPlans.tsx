"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import PaystackButton from "@/components/PaystackButton";
import type { MembershipPlan, PlanId } from "@/lib/payments";

export default function MembershipPlans({ plans, currentPlan }: { plans: MembershipPlan[]; currentPlan: PlanId | "none" }) {
  const { user } = useAuth();
  const [subscribedPlan, setSubscribedPlan] = useState<PlanId | null>(null);
  const [errorMsg, setErrorMsg] = useState<Record<string, string>>({});

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((p) => {
        const isDone = subscribedPlan === p.id || currentPlan === p.id;
        return (
          <div
            key={p.id}
            className={`rounded-md p-7 border flex flex-col ${
              p.highlight
                ? "border-[var(--color-blaze)] bg-[var(--gradient-card)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)]"
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

            {isDone ? (
              <div className="mt-8 flex items-center justify-center gap-2 rounded-sm border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 px-4 py-3 text-sm text-[var(--color-success)]">
                <CheckCircle2 size={16} />
                You&rsquo;re on this plan
              </div>
            ) : !user ? (
              <Link
                href="/login"
                className={`mt-8 inline-flex justify-center rounded-sm px-5 py-3 text-sm font-semibold transition-colors ${
                  p.highlight
                    ? "bg-[var(--color-blaze)] text-white hover:bg-[var(--color-blaze-dark)]"
                    : "border border-[var(--color-border-strong)] text-[var(--color-text)] hover:border-[var(--color-blaze)]"
                }`}
              >
                Sign in to subscribe
              </Link>
            ) : (
              <div className="mt-8">
                {errorMsg[p.id] && <p className="mb-2 text-xs text-[var(--color-danger)]">{errorMsg[p.id]}</p>}
                <PaystackButton
                  email={user.email ?? ""}
                  amountNaira={p.priceNaira}
                  purpose={{ type: "membership", planId: p.id }}
                  label={`Subscribe — ₦${p.priceNaira.toLocaleString()}`}
                  className={`w-full inline-flex justify-center rounded-sm px-5 py-3 text-sm font-semibold transition-colors ${
                    p.highlight
                      ? "bg-[var(--color-blaze)] text-white hover:bg-[var(--color-blaze-dark)]"
                      : "border border-[var(--color-border-strong)] text-[var(--color-text)] hover:border-[var(--color-blaze)]"
                  }`}
                  onSuccess={() => setSubscribedPlan(p.id)}
                  onError={(msg) => setErrorMsg((m) => ({ ...m, [p.id]: msg }))}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
