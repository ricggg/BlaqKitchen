import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Cancels a booking. RLS ("Users manage own bookings") already prevents a
// user from cancelling anyone else's row, but we still scope the query by
// user_id ourselves — never trust the client to have sent the right id.
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
