import { createClient } from "@/lib/supabase/server";
import { DEMO_BILLING, type BillingRecord } from "@/lib/payments";

export async function getBillingHistory(userId: string): Promise<BillingRecord[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("id, purpose, amount_naira, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) return DEMO_BILLING;

  return data.map((p: any) => ({
    id: p.id,
    description: p.purpose === "membership" ? "Membership — payment" : "Blaqs Kitchen order",
    amountNaira: p.amount_naira,
    status: p.status,
    date: new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  }));
}
