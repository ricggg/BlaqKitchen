import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client — SERVER ONLY. Never import this into a "use client"
 * file or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 * Bypasses RLS: use only for trusted server-side aggregate reads/writes
 * (admin dashboards, webhooks, server actions).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
