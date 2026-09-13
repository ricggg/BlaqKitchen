"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import type { RevenuePoint } from "@/lib/admin";

export default function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="h-72 -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="label" stroke="var(--color-text-faint)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="var(--color-text-faint)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₦${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-border-strong)", borderRadius: 4, fontSize: 12 }}
            formatter={(v: number) => `₦${v.toLocaleString()}`}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="gym" name="Gym" fill="var(--color-blaze)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="kitchen" name="Blags Kitchen" fill="var(--color-brass)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
