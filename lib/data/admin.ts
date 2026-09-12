import { createClient } from "@/lib/supabase/server";
import {
  ADMIN_STATS,
  REVENUE_SERIES,
  ADMIN_MEMBERS,
  ADMIN_TRAINERS,
  ADMIN_PAYMENTS,
  type AdminMember,
  type AdminTrainer,
  type AdminPayment,
  type RevenuePoint,
} from "@/lib/admin";

/**
 * Admin dashboard data access (Batch 6). Called only from within
 * app/admin/*, which is gated server-side by requireAdmin() in
 * app/admin/layout.tsx — so the authenticated (RLS-respecting) client is
 * safe to use here rather than the service-role client.
 */

const PLAN_LABEL: Record<string, AdminMember["plan"]> = {
  none: "None",
  pay_as_you_go: "Pay As You Go",
  monthly: "Monthly Unlimited",
  annual: "Annual Elite",
};

export async function getAdminMembers(): Promise<AdminMember[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, membership_plan, membership_expires_at, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data || data.length === 0) return ADMIN_MEMBERS;

  // Email lives in auth.users, not profiles, and the anon-scoped client
  // here can't read it — omit it rather than reaching for the
  // service-role client just to display it in a table.
  return data.map((p: any) => ({
    id: p.id,
    name: p.full_name || "Member",
    email: "", // email lives in auth.users; join via a view or the service-role client if needed
    plan: PLAN_LABEL[p.membership_plan] ?? "None",
    joined: new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    status: p.membership_expires_at && new Date(p.membership_expires_at) < new Date() ? "expired" : "active",
  }));
}

export async function getAdminTrainers(): Promise<AdminTrainer[]> {
  const supabase = createClient();

  const { data, error } = await supabase.from("trainers").select("id, name, specialty");

  if (error || !data || data.length === 0) return ADMIN_TRAINERS;

  const withCounts = await Promise.all(
    data.map(async (t) => {
      const { count } = await supabase
        .from("classes")
        .select("id", { count: "exact", head: true })
        .eq("trainer_id", t.id);
      return { id: t.id, name: t.name, specialty: t.specialty, classesThisWeek: count ?? 0 };
    })
  );

  return withCounts;
}

export async function getAdminPayments(): Promise<AdminPayment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("id, amount_naira, status, purpose, created_at, user_id, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data || data.length === 0) return ADMIN_PAYMENTS;

  return data.map((p: any) => ({
    id: p.id,
    customer: p.profiles?.full_name || "Member",
    description: p.purpose === "membership" ? "Membership — renewal" : "Blaqs Kitchen order",
    amountNaira: p.amount_naira,
    status: p.status,
    date: new Date(p.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
  }));
}

export async function getAdminStats() {
  const supabase = createClient();

  const [{ count: activeMembers }, { count: classesToday }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).neq("membership_plan", "none"),
    supabase.from("classes").select("id", { count: "exact", head: true }).eq("day_of_week", new Date().getDay()),
  ]);

  if (activeMembers === null && classesToday === null) return ADMIN_STATS;

  return {
    activeMembers: activeMembers ?? ADMIN_STATS.activeMembers,
    classesToday: classesToday ?? ADMIN_STATS.classesToday,
    todayCheckIns: ADMIN_STATS.todayCheckIns, // wired up once attendance lands (Batch 16)
    monthRevenueNaira: ADMIN_STATS.monthRevenueNaira, // wired up once payments has enough volume to aggregate meaningfully
  };
}

export async function getRevenueSeries(): Promise<RevenuePoint[]> {
  // Recharts series stays on demo data until there's enough real payment
  // history to aggregate by day — swap for a `payments` group-by query
  // (Batch 22: Analytics) once volume justifies it.
  return REVENUE_SERIES;
}
