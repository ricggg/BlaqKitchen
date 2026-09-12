"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Flame } from "lucide-react";
import { CATEGORY_LABEL, CATEGORY_ORDER, DEMO_MENU, type MenuCategory } from "@/lib/kitchen";
import { useCart } from "@/lib/cart-context";

export default function MenuGrid() {
  const [active, setActive] = useState<MenuCategory | "all">("all");
  const { addItem } = useCart();

  const items = useMemo(
    () => (active === "all" ? DEMO_MENU : DEMO_MENU.filter((m) => m.category === active)),
    [active]
  );

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-5 px-5 md:mx-0 md:px-0">
        <button
          onClick={() => setActive("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
            active === "all"
              ? "bg-[var(--color-brass)] border-[var(--color-brass)] text-black"
              : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          All
        </button>
        {CATEGORY_ORDER.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
              active === c
                ? "bg-[var(--color-brass)] border-[var(--color-brass)] text-black"
                : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
            className="group relative rounded-md border border-[var(--color-border)] bg-[var(--gradient-card)] p-5 flex flex-col"
          >
            {item.popular && (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-[var(--color-brass)]/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-brass)]">
                <Flame size={10} /> Popular
              </span>
            )}
            <p className="text-xs text-[var(--color-brass)] mb-2">{item.tag}</p>
            <h3 className="font-[family-name:var(--font-display)] uppercase text-base text-[var(--color-text)] leading-snug pr-16">
              {item.name}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed flex-1">
              {item.description}
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                ₦{item.priceNaira.toLocaleString()}
              </span>
              <button
                onClick={() => addItem(item)}
                className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--color-brass)] px-3 py-1.5 text-xs font-semibold text-[var(--color-brass)] hover:bg-[var(--color-brass)] hover:text-black transition-colors"
              >
                <Plus size={13} />
                Add
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
