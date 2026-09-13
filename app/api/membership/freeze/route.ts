import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Batch 9 addition to the Batch 8 membership engine — freeze/resume was
// listed in the blueprint's dashboard requirements but only cancel had
// been built. Freezing a membership keeps membership_plan/expiry intact
// (it's not a cancellation) but blocks class booking server-side, see
// app/api/bookings/route.ts.
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const action: "freeze" | "resume" | undefined = body?.action;

  if (action !== "freeze" && action !== "resume") {
    return NextResponse.json({ error: "action must be 'freeze' or 'resume'" }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("membership_plan")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Could not load profile" }, { status: 500 });
  }

  if (!profile.membership_plan || profile.membership_plan === "none") {
    return NextResponse.json({ error: "No active membership to freeze." }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ membership_frozen: action === "freeze" })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { data: sub } = await supabase
    .from("membership_subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (sub) {
    await supabase
      .from("membership_subscriptions")
      .update({ frozen_at: action === "freeze" ? new Date().toISOString() : null })
      .eq("id", sub.id);
    await supabase
      .from("membership_events")
      .insert({ subscription_id: sub.id, event_type: action === "freeze" ? "frozen" : "resumed", metadata: {} });
  }

  return NextResponse.json({ ok: true });
}
