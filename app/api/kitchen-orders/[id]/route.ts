import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_STATUSES = ["received", "preparing", "ready", "completed", "cancelled"];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // NOTE: RLS on kitchen_orders (see supabase/schema.sql) restricts updates
  // to the order owner or a profile with is_admin = true, so this route
  // relies on the database policy rather than an app-level admin check.
  const body = await request.json().catch(() => null);
  const status: string | undefined = body?.status;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("kitchen_orders")
    .update({ status })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order: data });
}
