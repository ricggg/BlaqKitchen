import { Users, CalendarCheck2, Wallet, Flame } from "lucide-react";
import { getAdminStats, getRevenueSeries } from "@/lib/data/admin";
import RevenueChart from "@/components/RevenueChart";

export default async function AdminOverview() {
  const [stats, revenue] = await Promise.all([getAdminStats(), getRevenueSeries()]);

  const STATS = [
    { icon: Users, label: "Active members", value: stats.activeMembers.toLocaleString() },
    { icon: CalendarCheck2, label: "Classes today", value: stats.classesToday },
    { icon: Flame, label: "Check-ins today", value: stats.todayCheckIns },
    { icon: Wallet, label: "Revenue this month", value: `₦${(stats.monthRevenueNaira / 1_000_000).toFixed(1)}M` },
  ];

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl text-[var(--color-text)] mb-6">
        Overview
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <s.icon size={18} className="text-[var(--color-blaze)]" />
            <p className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)]">{s.value}</p>
            <p className="text-xs text-[var(--color-text-faint)] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <p className="font-semibold text-[var(--color-text)] mb-1">Revenue this week</p>
        <p className="text-xs text-[var(--color-text-faint)] mb-6">Gym memberships vs. Blaqs Kitchen</p>
        <RevenueChart data={revenue} />
      </div>
    </div>
  );
}
