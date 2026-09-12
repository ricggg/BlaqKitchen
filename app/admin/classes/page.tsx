"use client";

import { Plus } from "lucide-react";
import { CATEGORY_LABEL, DAY_LABEL, DEMO_CLASSES } from "@/lib/classes";

export default function AdminClassesPage() {
  const rows = [...DEMO_CLASSES].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl text-[var(--color-text)]">
          Classes
        </h2>
        <button className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-blaze)] px-4 py-2 text-sm font-semibold text-white">
          <Plus size={16} /> Add class
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-faint)]">
              <th className="px-5 py-3 font-medium">Class</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Trainer</th>
              <th className="px-5 py-3 font-medium">When</th>
              <th className="px-5 py-3 font-medium">Capacity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-[var(--color-border)] last:border-0 bg-[var(--color-surface)]">
                <td className="px-5 py-3.5 text-[var(--color-text)] font-medium">{c.name}</td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)]">{CATEGORY_LABEL[c.category]}</td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)]">{c.trainer}</td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)]">{DAY_LABEL[c.dayOfWeek]} · {c.startTime}</td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)]">{c.booked}/{c.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
