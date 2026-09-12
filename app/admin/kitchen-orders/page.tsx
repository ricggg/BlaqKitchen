"use client";

import { useState } from "react";
import { ADMIN_DEMO_ORDERS, STATUS_LABEL, STATUS_COLOR, type OrderStatus, type KitchenOrder } from "@/lib/kitchen";

const STATUS_FLOW: OrderStatus[] = ["received", "preparing", "ready", "completed", "cancelled"];

export default function AdminKitchenOrdersPage() {
  // Demo data renders until Supabase is wired up. Replace with a fetch to
  // GET /api/kitchen-orders (extended to return all orders for admins)
  // and PATCH /api/kitchen-orders/[id] to persist status changes.
  const [orders, setOrders] = useState<KitchenOrder[]>(ADMIN_DEMO_ORDERS);

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    fetch(`/api/kitchen-orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {
      /* demo data — real errors should re-sync from the server */
    });
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl text-[var(--color-text)] mb-6">
        Kitchen orders
      </h2>

      <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-faint)]">
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Placed</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-[var(--color-border)] last:border-0 bg-[var(--color-surface)] align-top">
                <td className="px-5 py-3.5 text-[var(--color-text)] font-medium whitespace-nowrap">{o.customerName}</td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)] max-w-xs">
                  {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                </td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)] whitespace-nowrap">
                  {o.orderType === "dine_in" ? `Dine in · ${o.tableNumber}` : "Pickup"}
                </td>
                <td className="px-5 py-3.5 text-[var(--color-text)] font-medium whitespace-nowrap">
                  ₦{o.totalNaira.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)] whitespace-nowrap">{o.createdAt}</td>
                <td className="px-5 py-3.5">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium border-0 focus:outline-none focus:ring-1 focus:ring-[var(--color-brass)] ${STATUS_COLOR[o.status]}`}
                  >
                    {STATUS_FLOW.map((s) => (
                      <option key={s} value={s} className="bg-[var(--color-surface-elevated)] text-[var(--color-text)]">
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
