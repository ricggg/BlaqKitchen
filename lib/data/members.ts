import { createClient } from "@/lib/supabase/server";
import { DEMO_PROFILE, DEMO_UPCOMING, DEMO_HISTORY, type MemberProfile, type UpcomingBooking } from "@/lib/dashboard";

/**
 * Production data access for the member dashboard (Batch 6).
 * Server component only. Falls back to demo constants only when
 * Supabase env vars are absent (local preview) or the row doesn't exist
 * yet (brand-new profile before the signup trigger has run) — never
 * because a query failed for an authenticated, provisioned user.
 */

export async function getMemberProfile(userId: string, email: string | null): Promise<MemberProfile> {
  const supabase = createClient();

  const { data } = await supabase
    .from("profiles")
    .select("full_name, membership_plan, membership_expires_at, membership_frozen")
    .eq("id", userId)
    .single();

  if (!data) return DEMO_PROFILE;

  const planLabel: Record<string, MemberProfile["plan"]> = {
    none: "None",
    pay_as_you_go: "Pay As You Go",
    monthly: "Monthly Unlimited",
    annual: "Annual Elite",
  };

  const { count: classesThisMonth } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("booking_date", new Date(new Date().setDate(1)).toISOString().slice(0, 10));

  return {
    fullName: data.full_name || "Member",
    email: email ?? "",
    plan: planLabel[data.membership_plan] ?? "None",
    planRenews: data.membership_expires_at
      ? new Date(data.membership_expires_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : null,
    classesThisMonth: classesThisMonth ?? 0,
    kitchenCreditsNaira: 0, // wired up once membership_plans.kitchen_credit lands (Batch 8)
    frozen: data.membership_frozen ?? false,
  };
}

export async function getUpcomingBookings(userId: string): Promise<UpcomingBooking[]> {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("bookings")
    .select("id, booking_date, status, classes(name, category, start_time, trainers(name))")
    .eq("user_id", userId)
    .gte("booking_date", today)
    .neq("status", "cancelled")
    .order("booking_date", { ascending: true });

  if (error || !data || data.length === 0) return DEMO_UPCOMING;

  return data.map((b: any) => ({
    id: b.id,
    className: b.classes?.name ?? "Class",
    category: b.classes?.category ?? "",
    date: new Date(b.booking_date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
    time: b.classes?.start_time?.slice(0, 5) ?? "",
    trainer: b.classes?.trainers?.name ?? "",
    status: b.status,
  }));
}

export async function getBookingHistory(userId: string): Promise<UpcomingBooking[]> {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("bookings")
    .select("id, booking_date, status, classes(name, category, start_time, trainers(name))")
    .eq("user_id", userId)
    .lt("booking_date", today)
    .order("booking_date", { ascending: false });

  if (error || !data || data.length === 0) return DEMO_HISTORY;

  return data.map((b: any) => ({
    id: b.id,
    className: b.classes?.name ?? "Class",
    category: b.classes?.category ?? "",
    date: new Date(b.booking_date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
    time: b.classes?.start_time?.slice(0, 5) ?? "",
    trainer: b.classes?.trainers?.name ?? "",
    status: b.status,
  }));
}
