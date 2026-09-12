import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ membership_plan: "none", membership_expires_at: null })
    .eq("id", user.id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // Best-effort mirror into membership_subscriptions/events — skip quietly
  // if the table isn't seeded yet, same pattern as the verify route.
  const { data: sub } = await supabase
    .from("membership_subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (sub) {
    await supabase
      .from("membership_subscriptions")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", sub.id);
    await supabase.from("membership_events").insert({ subscription_id: sub.id, event_type: "cancelled", metadata: {} });
  }

  return NextResponse.json({ ok: true });
}
