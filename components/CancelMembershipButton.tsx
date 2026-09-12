"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelMembershipButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function cancel() {
    setBusy(true);
    const res = await fetch("/api/membership/cancel", { method: "POST" });
    setBusy(false);
    if (res.ok) {
      setConfirming(false);
      router.refresh();
    }
  }

  if (confirming) {
    return (
      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs text-[var(--color-text-muted)]">Cancel your membership?</span>
        <button
          onClick={cancel}
          disabled={busy}
          className="text-sm font-medium text-[var(--color-danger)] hover:underline disabled:opacity-60"
        >
          {busy ? "Cancelling…" : "Yes, cancel"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-sm text-[var(--color-text-muted)] hover:underline">
          Keep plan
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="mt-6 ml-3 text-sm text-[var(--color-text-faint)] hover:text-[var(--color-danger)] transition-colors"
    >
      Cancel membership
    </button>
  );
}
