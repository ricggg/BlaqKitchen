"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { nairaToKobo, type PaymentPurpose } from "@/lib/payments";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

const PAYSTACK_SCRIPT_SRC = "https://js.paystack.co/v1/inline.js";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();
    const existing = document.querySelector(`script[src="${PAYSTACK_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }
    const script = document.createElement("script");
    script.src = PAYSTACK_SCRIPT_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.body.appendChild(script);
  });
}

export default function PaystackButton({
  email,
  amountNaira,
  purpose,
  label,
  className,
  disabled,
  onSuccess,
  onError,
}: {
  email: string;
  amountNaira: number;
  purpose: PaymentPurpose;
  label: string;
  className?: string;
  disabled?: boolean;
  onSuccess: (reference: string) => void;
  onError?: (message: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "verifying">("idle");
  const demoMode = !PUBLIC_KEY;

  useEffect(() => {
    if (!demoMode) loadPaystackScript().catch(() => onError?.("Couldn't load the payment provider."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode]);

  async function verify(reference: string) {
    setStatus("verifying");
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, purpose }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Payment could not be verified");
      onSuccess(reference);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Payment could not be verified");
    } finally {
      setStatus("idle");
    }
  }

  function pay() {
    if (demoMode) {
      // No Paystack key configured yet — simulate a successful charge so
      // the booking/order flow is fully clickable in preview/dev. Swap
      // in real NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY + PAYSTACK_SECRET_KEY to
      // go live with real charges.
      const demoReference = `demo_${Date.now()}`;
      verify(demoReference);
      return;
    }

    if (!window.PaystackPop) {
      onError?.("Payment provider is still loading — try again in a moment.");
      return;
    }

    setStatus("loading");
    const handler = window.PaystackPop.setup({
      key: PUBLIC_KEY,
      email,
      amount: nairaToKobo(amountNaira),
      currency: "NGN",
      metadata: purpose,
      callback: (response: { reference: string }) => {
        verify(response.reference);
      },
      onClose: () => setStatus("idle"),
    });
    handler.openIframe();
  }

  const busy = status !== "idle";

  return (
    <button
      onClick={pay}
      disabled={disabled || busy}
      className={
        className ??
        "w-full inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-blaze)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--color-blaze-dark)] transition-colors disabled:opacity-60"
      }
    >
      {busy && <Loader2 size={15} className="animate-spin" />}
      {status === "verifying" ? "Confirming payment…" : status === "loading" ? "Opening secure checkout…" : label}
      {demoMode && !busy && <span className="text-[10px] font-normal opacity-70">(demo)</span>}
    </button>
  );
}
