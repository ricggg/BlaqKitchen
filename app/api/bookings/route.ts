import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  if (!classId) {
    return NextResponse.json({ error: "classId is required" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("bookings")
    .insert({ user_id: user.id, class_id: classId, booking_date: today })
    .select()
    .single();

  if (error) {
    // Unique violation = already booked this class for today.
    const alreadyBooked = error.code === "23505";
    return NextResponse.json(
      { error: alreadyBooked ? "You already booked this class." : error.message },
      { status: alreadyBooked ? 409 : 500 }
    );
  }

  return NextResponse.json({ booking: data });
}
