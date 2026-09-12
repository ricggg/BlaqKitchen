"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import PaystackButton from "./PaystackButton";
import type { OrderType } from "@/lib/kitchen";

type Stage = "form" | "pay" | "done" | "error";

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { lines, subtotalNaira, clear } = useCart();
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "counter">("online");
  const [stage, setStage] = useState<Stage>("form");
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function placeOrder() {
    setPlacing(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/kitchen-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ id: l.id, name: l.name, unitPriceNaira: l.priceNaira, quantity: l.quantity })),
          orderType,
          tableNumber: orderType === "dine_in" ? tableNumber : undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Couldn't place that order — try again.");

      setOrderId(data.order.id);

      if (paymentMethod === "counter") {
        clear();
        setStage("done");
      } else {
        setStage("pay");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Couldn't place that order — try again.");
      setStage("error");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-5"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-md rounded-t-md sm:rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 max-h-[90svh] overflow-y-auto"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[var(--color-brass)] mb-1">Blaqs Kitchen</p>
              <h3 className="font-[family-name:var(--font-display)] uppercase text-xl text-[var(--color-text)]">
                {stage === "pay" ? "Pay for your order" : "Confirm order"}
              </h3>
            </div>
            <button onClick={onClose} aria-label="Close" className="text-[var(--color-text-faint)]">
              <X size={20} />
            </button>
          </div>

          {stage === "done" ? (
            <div className="mt-6 flex items-center gap-2 rounded-sm border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 px-4 py-3 text-sm text-[var(--color-success)]">
              <CheckCircle2 size={18} />
              Order placed — track it from your dashboard.
            </div>
          ) : !user ? (
            <div className="mt-6">
              <p className="text-sm text-[var(--color-text-muted)] mb-3">Sign in to place this order.</p>
              <Link
                href="/login"
                className="inline-flex w-full justify-center rounded-sm bg-[var(--color-brass)] px-4 py-3 text-sm font-semibold text-black"
              >
                Sign in to order
              </Link>
            </div>
          ) : stage === "pay" && orderId ? (
            <div className="mt-6">
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                Total due: <span className="font-semibold text-[var(--color-brass)]">₦{subtotalNaira.toLocaleString()}</span>
              </p>
              {errorMsg && <p className="mb-3 text-sm text-[var(--color-danger)]">{errorMsg}</p>}
              <PaystackButton
                email={user.email ?? ""}
                amountNaira={subtotalNaira}
                purpose={{ type: "kitchen_order", orderId }}
                label="Pay now"
                className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-brass)] px-4 py-3 text-sm font-semibold text-black hover:bg-[var(--color-brass-dark)] hover:text-white transition-colors disabled:opacity-60"
                onSuccess={() => {
                  clear();
                  setStage("done");
                }}
                onError={(msg) => setErrorMsg(msg)}
              />
              <p className="mt-3 text-xs text-[var(--color-text-faint)] text-center">
                Your order is already in the kitchen queue — this just settles payment.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 flex flex-col gap-px bg-[var(--color-border)] rounded-md overflow-hidden">
                {lines.map((l) => (
                  <div key={l.id} className="bg-[var(--color-surface-elevated)] px-4 py-2.5 flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">
                      {l.quantity} × {l.name}
                    </span>
                    <span className="text-[var(--color-text)] font-medium">
                      ₦{(l.quantity * l.priceNaira).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                {(["pickup", "dine_in"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setOrderType(t)}
                    className={`flex-1 rounded-sm border px-3 py-2.5 text-sm font-medium transition-colors ${
                      orderType === t
                        ? "bg-[var(--color-brass)] border-[var(--color-brass)] text-black"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    {t === "pickup" ? "Pickup" : "Dine in"}
                  </button>
                ))}
              </div>

              {orderType === "dine_in" && (
                <input
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Table number (e.g. T4)"
                  className="mt-3 w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-sm px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-brass)]"
                />
              )}

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes for the kitchen (allergies, spice level…)"
                rows={2}
                className="mt-3 w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-sm px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-brass)] resize-none"
              />

              <p className="mt-4 mb-2 text-xs text-[var(--color-text-faint)]">Payment</p>
              <div className="flex gap-2">
                {([
                  { id: "online" as const, label: "Pay online" },
                  { id: "counter" as const, label: orderType === "dine_in" ? "Pay at table" : "Pay at pickup" },
                ]).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex-1 rounded-sm border px-3 py-2.5 text-sm font-medium transition-colors ${
                      paymentMethod === m.id
                        ? "bg-[var(--color-brass)] border-[var(--color-brass)] text-black"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Total</span>
                <span className="text-lg font-semibold text-[var(--color-brass)]">
                  ₦{subtotalNaira.toLocaleString()}
                </span>
              </div>

              {stage === "error" && (
                <p className="mt-3 text-sm text-[var(--color-danger)]">{errorMsg}</p>
              )}

              <button
                onClick={placeOrder}
                disabled={placing || lines.length === 0 || (orderType === "dine_in" && !tableNumber)}
                className="mt-4 w-full rounded-sm bg-[var(--color-brass)] px-4 py-3 text-sm font-semibold text-black hover:bg-[var(--color-brass-dark)] hover:text-white transition-colors disabled:opacity-60"
              >
                {placing ? "Placing order…" : paymentMethod === "online" ? "Continue to payment" : "Place order"}
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
