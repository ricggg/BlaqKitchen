"use client";

import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { DEMO_ORDERS, STATUS_LABEL, STATUS_COLOR } from "@/lib/kitchen";

export default function KitchenOrdersPage() {
  // Demo data renders until Supabase is wired up. Replace with:
  //   fetch("/api/kitchen-orders").then(r => r.json())
  const orders = DEMO_ORDERS;

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl text-[var(--color-text)] mb-6">
        Kitchen orders
      </h2>

      {orders.length === 0 ? (
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">No orders yet.</p>
          <Link href="/kitchen" className="mt-4 inline-block text-sm font-medium text-[var(--color-brass)]">
            Browse the menu
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-px bg-[var(--color-border)] rounded-md overflow-hidden">
          {orders.map((o) => (
            <div key={o.id} className="bg-[var(--color-surface)] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UtensilsCrossed size={16} className="text-[var(--color-brass)] shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                    </p>
                    <p className="text-xs text-[var(--color-text-faint)] mt-1">
                      {o.orderType === "dine_in" ? `Dine in · ${o.tableNumber}` : "Pickup"} · {o.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[o.status]}`}>
                    {STATUS_LABEL[o.status]}
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-text)]">
                    ₦{o.totalNaira.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/kitchen"
        className="mt-6 inline-block text-sm font-medium text-[var(--color-brass)]"
      >
        Order again →
      </Link>
    </div>
  );
}
