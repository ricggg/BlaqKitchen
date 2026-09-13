export type UpcomingBooking = {
  id: string;
  className: string;
  category: string;
  date: string; // "Mon, 15 Sep"
  time: string;
  trainer: string;
  status: "confirmed" | "cancelled" | "waitlisted";
};

export type MemberProfile = {
  fullName: string;
  email: string;
  plan: "None" | "Pay As You Go" | "Monthly Unlimited" | "Annual Elite";
  planRenews: string | null;
  classesThisMonth: number;
  kitchenCreditsNaira: number;
  frozen: boolean;
};

/**
 * Demo data so the dashboard renders before Supabase is wired up.
 * Replace with:
 *   supabase.from("bookings").select("*, classes(*)").eq("user_id", user.id)
 *   supabase.from("profiles").select("*").eq("id", user.id).single()
 */
export const DEMO_PROFILE: MemberProfile = {
  fullName: "Member",
  email: "member@blaggym.com",
  plan: "Monthly Unlimited",
  planRenews: "3 Oct 2026",
  classesThisMonth: 9,
  kitchenCreditsNaira: 4500,
  frozen: false,
};

export const DEMO_UPCOMING: UpcomingBooking[] = [
  { id: "b1", className: "HIIT Burn", category: "HIIT & Conditioning", date: "Mon, 15 Sep", time: "07:00", trainer: "Coach Amaka", status: "confirmed" },
  { id: "b2", className: "Boxing Conditioning", category: "Boxing & Combat Fit", date: "Wed, 17 Sep", time: "06:00", trainer: "Coach Tega", status: "confirmed" },
  { id: "b3", className: "Mobility & Stretch", category: "Recovery & Mobility", date: "Sun, 21 Sep", time: "09:00", trainer: "Coach Sarah", status: "confirmed" },
];

export const DEMO_HISTORY: UpcomingBooking[] = [
  { id: "h1", className: "Foundations Strength", category: "Strength & Powerlifting", date: "Mon, 8 Sep", time: "06:00", trainer: "Coach Ebi", status: "confirmed" },
  { id: "h2", className: "HIIT Burn", category: "HIIT & Conditioning", date: "Thu, 4 Sep", time: "18:00", trainer: "Coach Amaka", status: "confirmed" },
];
