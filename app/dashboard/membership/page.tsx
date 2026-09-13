import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMemberProfile } from "@/lib/data/members";
import { getBillingHistory } from "@/lib/data/billing";
import CancelMembershipButton from "@/components/CancelMembershipButton";
import FreezeMembershipButton from "@/components/FreezeMembershipButton";

const STATUS_COLOR: Record<string, string> = {
  success: "text-[var(--color-success)] bg-[var(--color-success)]/10",
  pending: "text-[var(--color-warn)] bg-[var(--color-warn)]/10",
  failed: "text-[var(--color-danger)] bg-[var(--color-danger)]/10",
};

export default async function DashboardMembershipPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profile, billing] = await Promise.all([
    getMemberProfile(user.id, user.email ?? null),
    getBillingHistory(user.id),
  ]);

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl text-[var(--color-text)] mb-6">
        Membership
      </h2>
      <div className="rounded-md border border-[var(--color-border)] bg-[var(--gradient-card)] p-6 max-w-md">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--color-text-faint)]">Current plan</p>
          {profile.frozen && (
            <span className="rounded-full bg-[var(--color-warn)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-warn)]">
              Frozen
            </span>
          )}
        </div>
        <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)]">
          {profile.plan}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          {profile.planRenews ? `Renews ${profile.planRenews}` : "No active subscription"}
        </p>
        {profile.frozen && (
          <p className="text-xs text-[var(--color-warn)] mt-1">
            Class booking is paused while your membership is frozen.
          </p>
        )}
        <div className="flex items-center flex-wrap">
          <Link
            href="/membership"
            className="mt-6 inline-flex rounded-sm border border-[var(--color-border-strong)] px-4 py-2.5 text-sm text-[var(--color-text)] hover:border-[var(--color-blaze)]"
          >
            Change plan
          </Link>
          {profile.plan !== "None" && <FreezeMembershipButton frozen={profile.frozen} />}
          {profile.plan !== "None" && <CancelMembershipButton />}
        </div>
      </div>

      <h3 className="mt-10 mb-4 text-sm font-semibold text-[var(--color-text)]">Billing history</h3>
      <div className="flex flex-col gap-px bg-[var(--color-border)] rounded-md overflow-hidden max-w-2xl">
        {billing.map((b) => (
          <div key={b.id} className="bg-[var(--color-surface)] px-5 py-3.5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--color-text)]">{b.description}</p>
              <p className="text-xs text-[var(--color-text-faint)] mt-0.5">{b.date}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[b.status]}`}>
                {b.status}
              </span>
              <span className="text-sm font-semibold text-[var(--color-text)] w-20 text-right">
                ₦{b.amountNaira.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        {billing.length === 0 && (
          <div className="bg-[var(--color-surface)] px-5 py-10 text-center text-sm text-[var(--color-text-faint)]">
            No payments yet.
          </div>
        )}
      </div>
    </div>
  );
}
