"use client";

import { createClient } from "@/lib/supabase/client";
import { DEMO_CLASSES, type ClassCategory, type GymClass } from "@/lib/classes";

/**
 * Client-side fetch for /schedule (Batch 6). Falls back to DEMO_CLASSES
 * only when Supabase isn't configured or the `classes` table is empty —
 * lets the page render in local preview before `supabase/schema.sql`
 * has been run and seeded.
 */
export async function fetchClasses(): Promise<GymClass[]> {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("classes")
    .select("id, name, category, day_of_week, start_time, duration_minutes, capacity, trainers(name)");

  if (error || !data || data.length === 0) return DEMO_CLASSES;

  const { data: todaysBookings } = await supabase
    .from("bookings")
    .select("class_id")
    .eq("booking_date", today)
    .neq("status", "cancelled");

  const bookedByClass = new Map<string, number>();
  for (const b of todaysBookings ?? []) {
    bookedByClass.set(b.class_id, (bookedByClass.get(b.class_id) ?? 0) + 1);
  }

  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    category: c.category as ClassCategory,
    trainer: c.trainers?.name ?? "TBA",
    dayOfWeek: c.day_of_week,
    startTime: c.start_time?.slice(0, 5) ?? "",
    durationMinutes: c.duration_minutes,
    capacity: c.capacity,
    booked: bookedByClass.get(c.id) ?? 0,
  }));
}
