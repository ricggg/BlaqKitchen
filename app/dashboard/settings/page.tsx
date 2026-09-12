"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState((user?.user_metadata?.full_name as string) ?? "");
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    await supabase.auth.updateUser({ data: { full_name: name } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl text-[var(--color-text)] mb-6">
        Settings
      </h2>

      <form onSubmit={save} className="max-w-sm space-y-4">
        <div>
          <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-3.5 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-blaze)]"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">Email</label>
          <input
            disabled
            value={user?.email ?? ""}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-3.5 py-2.5 text-sm text-[var(--color-text-faint)]"
          />
        </div>
        <button
          type="submit"
          className="rounded-sm bg-[var(--color-blaze)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-blaze-dark)] transition-colors"
        >
          {saved ? "Saved" : "Save changes"}
        </button>
      </form>

      <button
        onClick={signOut}
        className="mt-10 text-sm text-[var(--color-danger)]"
      >
        Sign out
      </button>
    </div>
  );
}
