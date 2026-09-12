import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side authorization helpers. Never trust a client-side "isAdmin"
 * flag — this reads profiles.is_admin under RLS via the authenticated
 * server client, so a user cannot spoof their own admin status.
 */

export async function getServerUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/** Redirects to /login if signed out, or /dashboard if not an admin. */
export async function requireAdmin() {
  const { supabase, user } = await getServerUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, role")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/dashboard");

  return { supabase, user, profile };
}
