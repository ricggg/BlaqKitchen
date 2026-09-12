export type AdminMember = {
  id: string;
  name: string;
  email: string;
  plan: "None" | "Pay As You Go" | "Monthly Unlimited" | "Annual Elite";
  joined: string;
  status: "active" | "expired";
};

export type AdminTrainer = {
  id: string;
  name: string;
  specialty: string;
  classesThisWeek: number;
};

export type AdminPayment = {
  id: string;
  customer: string;
  description: string;
  amountNaira: number;
  status: "success" | "pending" | "failed";
  date: string;
};

export type RevenuePoint = { label: string; gym: number; kitchen: number };

/**
 * Demo data for the admin dashboard. Swap for real Supabase aggregate
 * queries (profiles, bookings, and the payments table added in Batch 5)
 * once those are live.
 */
export const ADMIN_STATS = {
  activeMembers: 1243,
  classesToday: 14,
  todayCheckIns: 187,
  monthRevenueNaira: 18_450_000,
};

export const REVENUE_SERIES: RevenuePoint[] = [
  { label: "Mon", gym: 620_000, kitchen: 210_000 },
  { label: "Tue", gym: 540_000, kitchen: 195_000 },
  { label: "Wed", gym: 710_000, kitchen: 260_000 },
  { label: "Thu", gym: 680_000, kitchen: 240_000 },
  { label: "Fri", gym: 900_000, kitchen: 340_000 },
  { label: "Sat", gym: 1_150_000, kitchen: 420_000 },
  { label: "Sun", gym: 780_000, kitchen: 300_000 },
];

export const ADMIN_MEMBERS: AdminMember[] = [
  { id: "m1", name: "Chidinma Okafor", email: "chidinma@example.com", plan: "Monthly Unlimited", joined: "12 Jan 2026", status: "active" },
  { id: "m2", name: "Tunde Balogun", email: "tunde@example.com", plan: "Annual Elite", joined: "3 Nov 2025", status: "active" },
  { id: "m3", name: "Grace Effiong", email: "grace@example.com", plan: "Pay As You Go", joined: "28 Aug 2026", status: "active" },
  { id: "m4", name: "Emeka Nwosu", email: "emeka@example.com", plan: "Monthly Unlimited", joined: "15 Mar 2026", status: "expired" },
];

export const ADMIN_TRAINERS: AdminTrainer[] = [
  { id: "t1", name: "Coach Ebi", specialty: "Strength & Powerlifting", classesThisWeek: 6 },
  { id: "t2", name: "Coach Amaka", specialty: "HIIT & Conditioning", classesThisWeek: 8 },
  { id: "t3", name: "Coach Tega", specialty: "Boxing & Combat Fit", classesThisWeek: 7 },
  { id: "t4", name: "Coach Sarah", specialty: "Recovery & Mobility", classesThisWeek: 5 },
];

export const ADMIN_PAYMENTS: AdminPayment[] = [
  { id: "p1", customer: "Chidinma Okafor", description: "Monthly Unlimited — renewal", amountNaira: 45000, status: "success", date: "Today · 09:12" },
  { id: "p2", customer: "Grace Effiong", description: "Blaqs Kitchen order", amountNaira: 12600, status: "success", date: "Today · 13:02" },
  { id: "p3", customer: "Tunde Balogun", description: "Annual Elite — renewal", amountNaira: 420000, status: "pending", date: "Yesterday · 17:44" },
  { id: "p4", customer: "Emeka Nwosu", description: "Pay As You Train — session", amountNaira: 6000, status: "failed", date: "Yesterday · 08:20" },
];
