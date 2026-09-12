"use client";

import { LayoutDashboard, CalendarDays, CreditCard, UtensilsCrossed, Settings } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import DashboardShell, { type NavItem } from "@/components/DashboardShell";

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "My bookings", icon: CalendarDays },
  { href: "/dashboard/membership", label: "Membership", icon: CreditCard },
  { href: "/dashboard/kitchen-orders", label: "Kitchen orders", icon: UtensilsCrossed },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <DashboardShell title="My account" eyebrow="Member" navItems={NAV}>
        {children}
      </DashboardShell>
    </RequireAuth>
  );
}
