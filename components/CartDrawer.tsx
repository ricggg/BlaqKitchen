"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import CheckoutModal from "./CheckoutModal";

export default function CartDrawer() {
  const { lines, isOpen, close, incrementLine, decrementLine, removeLine, subtotalNaira } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={close}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed top-0 right-0 z-50 h-[100svh] w-full sm:w-[400px] bg-[var(--color-surface)] border-l border-[var(--color-border-strong)] flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[var(--color-brass)]" />
                  <h3 className="font-[family-name:var(--font-display)] uppercase text-lg text-[var(--color-text)]">
                    Your order
                  </h3>
                </div>
                <button onClick={close} aria-label="Close cart" className="text-[var(--color-text-faint)]">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {lines.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-faint)] text-center mt-10">
                    Your cart is empty — add something tasty from the menu.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {lines.map((l) => (
                      <div key={l.id} className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--color-text)] truncate">{l.name}</p>
                          <p className="text-xs text-[var(--color-text-faint)] mt-0.5">
                            ₦{l.priceNaira.toLocaleString()} each
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => decrementLine(l.id)}
                              aria-label="Decrease quantity"
                              className="w-6 h-6 flex items-center justify-center rounded-sm border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-brass)] transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm text-[var(--color-text)] w-4 text-center">{l.quantity}</span>
                            <button
                              onClick={() => incrementLine(l.id)}
                              aria-label="Increase quantity"
                              className="w-6 h-6 flex items-center justify-center rounded-sm border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-brass)] transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <p className="text-sm font-semibold text-[var(--color-brass)]">
                            ₦{(l.priceNaira * l.quantity).toLocaleString()}
                          </p>
                          <button
                            onClick={() => removeLine(l.id)}
                            aria-label="Remove item"
                            className="text-[var(--color-text-faint)] hover:text-[var(--color-danger)] transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {lines.length > 0 && (
                <div className="border-t border-[var(--color-border)] px-5 py-4">
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <span className="text-[var(--color-text-muted)]">Subtotal</span>
                    <span className="text-lg font-semibold text-[var(--color-text)]">
                      ₦{subtotalNaira.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => setCheckingOut(true)}
                    className="w-full rounded-sm bg-[var(--color-brass)] px-4 py-3 text-sm font-semibold text-black hover:bg-[var(--color-brass-dark)] hover:text-white transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {checkingOut && <CheckoutModal onClose={() => setCheckingOut(false)} />}
    </>
  );
}
