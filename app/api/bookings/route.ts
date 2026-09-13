import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Batch 9 — booking is only ever trusted from here, never from the
// browser. Three things must hold before we insert a row:
//   1. The user is signed in.
//   2. The user has an active (non-expired, non-frozen) membership —
//      "pay_as_you_go" members are allowed too, since that plan is
//      explicitly a per-class drop-in.
//   3. The class still has a free spot for that date.
// (3) is also enforced by a DB trigger (enforce_class_capacity in
// schema.sql) as defense-in-depth, but we check it here too so we can
// return a clean, specific error message instead of a raw Postgres one.
export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const classId: string | undefined = body?.classId;
  const joinWaitlist: boolean = body?.joinWaitlist === true;

  if (!classId) {
    return NextResponse.json({ error: "classId is required" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("membership_plan, membership_expires_at, membership_frozen")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Could not verify membership" }, { status: 500 });
  }

  if (profile.membership_frozen) {
    return NextResponse.json(
      { error: "Your membership is frozen. Resume it from the dashboard to book classes." },
      { status: 403 }
    );
  }

  const hasNoPlan = !profile.membership_plan || profile.membership_plan === "none";
  const isExpired =
    profile.membership_expires_at !== null &&
    profile.membership_expires_at !== undefined &&
    new Date(profile.membership_expires_at) < new Date();

  if (hasNoPlan || isExpired) {
    return NextResponse.json(
      { error: "You need an active membership to book a class.", code: "NO_MEMBERSHIP" },
      { status: 403 }
    );
  }

  const { data: klass, error: classError } = await supabase
    .from("classes")
    .select("id, capacity")
    .eq("id", classId)
    .single();

  if (classError || !klass) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const { count: bookedCount, error: countError } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("class_id", classId)
    .eq("booking_date", today)
    .neq("status", "cancelled");

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if ((bookedCount ?? 0) >= klass.capacity) {
    if (!joinWaitlist) {
      return NextResponse.json({ error: "This class is fully booked.", code: "FULL" }, { status: 409 });
    }

    const { data: waitlistRow, error: waitlistError } = await supabase
      .from("bookings")
      .insert({ user_id: user.id, class_id: classId, booking_date: today, status: "waitlisted" })
      .select()
      .single();

    if (waitlistError) {
      if (waitlistError.code === "23505") {
        return NextResponse.json({ error: "You're already booked or waitlisted for this class." }, { status: 409 });
      }
      return NextResponse.json({ error: waitlistError.message }, { status: 500 });
    }

    return NextResponse.json({ booking: waitlistRow, waitlisted: true });
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({ user_id: user.id, class_id: classId, booking_date: today })
    .select()
    .single();

  if (error) {
    // Unique violation = already booked this class for today.
    // check_violation (from the DB trigger) = a concurrent request beat
    // us to the last spot between our count check and the insert.
    if (error.code === "23505") {
      return NextResponse.json({ error: "You already booked this class." }, { status: 409 });
    }
    if (error.code === "23514") {
      // Someone else took the last spot between our count check and this
      // insert. Fall through to the same "class is full" response the
      // client already knows how to offer a waitlist join for.
      return NextResponse.json({ error: "This class is fully booked.", code: "FULL" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}
