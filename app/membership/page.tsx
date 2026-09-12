import { createClient } from "@/lib/supabase/server";
import { getMembershipPlans } from "@/lib/data/plans";
import MembershipPlans from "@/components/MembershipPlans";
import type { PlanId } from "@/lib/payments";

export default async function MembershipPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [plans, profile] = await Promise.all([
    getMembershipPlans(),
    user
      ? supabase.from("profiles").select("membership_plan").eq("id", user.id).single().then((r) => r.data)
      : Promise.resolve(null),
  ]);

  const currentPlan = (profile?.membership_plan as PlanId | "none") ?? "none";

  return (
    <div className="bg-[var(--color-bg)] pt-16">
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-16 text-center">
        <p className="text-sm text-[var(--color-blaze)] mb-3">Membership</p>
        <h1 className="font-[family-name:var(--font-display)] uppercase text-4xl sm:text-5xl text-[var(--color-text)] max-w-2xl mx-auto text-balance">
          Pick a plan, train today
        </h1>
        <p className="mt-4 max-w-lg mx-auto text-[var(--color-text-muted)]">
          Secure checkout powered by Paystack. Cancel or switch plans anytime from your dashboard.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <MembershipPlans plans={plans} currentPlan={currentPlan} />
      </section>
    </div>
  );
}
