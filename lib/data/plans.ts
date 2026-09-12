import { createClient } from "@/lib/supabase/server";
import { MEMBERSHIP_PLANS, type MembershipPlan, type PlanId } from "@/lib/payments";

/**
 * Reads membership_plans from Supabase (Batch 8) so pricing/features live
 * in the database instead of only in lib/payments.ts. Falls back to the
 * MEMBERSHIP_PLANS constant when the table is empty (schema.sql not yet
 * re-run) so the page still renders in a fresh preview. The `code` column
 * matches PlanId exactly, so downstream checkout code is unaffected.
 */
export async function getMembershipPlans(): Promise<MembershipPlan[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("membership_plans")
    .select("code, name, price_naira, billing_interval, features")
    .eq("status", "active")
    .order("price_naira", { ascending: true });

  if (error || !data || data.length === 0) return MEMBERSHIP_PLANS;

  const PERIOD_LABEL: Record<string, string> = { one_off: "/session", monthly: "/month", annual: "/year" };

  return data.map((p: any) => ({
    id: p.code as PlanId,
    name: p.name,
    priceNaira: p.price_naira,
    period: PERIOD_LABEL[p.billing_interval] ?? "",
    features: p.features ?? [],
    highlight: p.code === "monthly",
  }));
}
