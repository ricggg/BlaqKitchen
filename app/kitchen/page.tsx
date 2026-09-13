"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import LaneDivider from "@/components/LaneDivider";
import MenuGrid from "@/components/MenuGrid";
import { useCart } from "@/lib/cart-context";

export default function KitchenPage() {
  const { count, open } = useCart();

  return (
    <div className="bg-[var(--color-bg)] pt-16">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(600px circle at 15% 20%, rgba(212,164,76,0.15), transparent 60%), radial-gradient(500px circle at 85% 60%, rgba(212,164,76,0.08), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8 pt-16 pb-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-[var(--color-brass)] mb-3"
          >
            Blags Kitchen
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-[family-name:var(--font-display)] uppercase text-4xl sm:text-5xl text-[var(--color-text)] max-w-2xl mx-auto text-balance"
          >
            Fuel made for the work you just put in
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-lg mx-auto text-[var(--color-text-muted)] leading-relaxed"
          >
            Order ahead for pickup, or dine in right off the training floor.
            Everything on the menu is built around real macros — no guessing.
          </motion.p>
        </div>
      </section>

      <LaneDivider accent="var(--color-brass)" />

      <section className="mx-auto max-w-7xl px-5 md:px-8 py-16">
        <MenuGrid />
      </section>

      {/* Floating cart button */}
      <button
        onClick={open}
        aria-label="Open cart"
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-[var(--color-brass)] px-5 py-3.5 text-sm font-semibold text-black shadow-lg shadow-black/40 hover:bg-[var(--color-brass-dark)] hover:text-white transition-colors"
      >
        <ShoppingBag size={18} />
        Cart
        {count > 0 && (
          <span className="inline-flex items-center justify-center rounded-full bg-black/80 text-white text-xs w-5 h-5">
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
