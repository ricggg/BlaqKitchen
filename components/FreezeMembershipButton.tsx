"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FreezeMembershipButton({ frozen }: { frozen: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const res = await fetch("/api/membership/freeze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: frozen ? "resume" : "freeze" }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className="mt-6 ml-3 text-sm text-[var(--color-text-faint)] hover:text-[var(--color-text)] transition-colors disabled:opacity-60"
    >
      {busy ? "Saving…" : frozen ? "Resume membership" : "Freeze membership"}
    </button>
  );
}
