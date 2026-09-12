export type ClassCategory = "strength" | "hiit" | "boxing" | "recovery";

export type GymClass = {
  id: string;
  name: string;
  category: ClassCategory;
  trainer: string;
  dayOfWeek: number; // 0 Sun ... 6 Sat
  startTime: string; // "06:00"
  durationMinutes: number;
  capacity: number;
  booked: number;
};

export const CATEGORY_LABEL: Record<ClassCategory, string> = {
  strength: "Strength & Powerlifting",
  hiit: "HIIT & Conditioning",
  boxing: "Boxing & Combat Fit",
  recovery: "Recovery & Mobility",
};

export const DAY_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Demo schedule shown when Supabase isn't configured yet, and used to
 * seed the `classes` table. Once NEXT_PUBLIC_SUPABASE_URL is set, real
 * pages fetch from `public.classes` / `public.trainers` instead.
 */
export const DEMO_CLASSES: GymClass[] = [
  { id: "c1", name: "Foundations Strength", category: "strength", trainer: "Coach Ebi", dayOfWeek: 1, startTime: "06:00", durationMinutes: 50, capacity: 20, booked: 12 },
  { id: "c2", name: "Powerlifting Lab", category: "strength", trainer: "Coach Ebi", dayOfWeek: 3, startTime: "17:30", durationMinutes: 60, capacity: 16, booked: 9 },
  { id: "c3", name: "HIIT Burn", category: "hiit", trainer: "Coach Amaka", dayOfWeek: 1, startTime: "07:00", durationMinutes: 45, capacity: 24, booked: 20 },
  { id: "c4", name: "HIIT Burn", category: "hiit", trainer: "Coach Amaka", dayOfWeek: 4, startTime: "18:00", durationMinutes: 45, capacity: 24, booked: 15 },
  { id: "c5", name: "Boxing Conditioning", category: "boxing", trainer: "Coach Tega", dayOfWeek: 2, startTime: "06:00", durationMinutes: 50, capacity: 22, booked: 18 },
  { id: "c6", name: "Boxing Conditioning", category: "boxing", trainer: "Coach Tega", dayOfWeek: 5, startTime: "17:00", durationMinutes: 50, capacity: 22, booked: 21 },
  { id: "c7", name: "Mobility & Stretch", category: "recovery", trainer: "Coach Sarah", dayOfWeek: 0, startTime: "09:00", durationMinutes: 40, capacity: 18, booked: 6 },
  { id: "c8", name: "Sauna & Recovery", category: "recovery", trainer: "Coach Sarah", dayOfWeek: 6, startTime: "10:00", durationMinutes: 40, capacity: 12, booked: 5 },
];
