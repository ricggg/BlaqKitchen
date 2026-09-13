import { LayoutDashboard, Users, Dumbbell, CalendarRange, UtensilsCrossed, Wallet } from "lucide-react";
import DashboardShell, { type NavItem } from "@/components/DashboardShell";
import { requireAdmin } from "@/lib/authz";

const NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/classes", label: "Classes", icon: CalendarRange },
  { href: "/admin/trainers", label: "Trainers", icon: Dumbbell },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/kitchen-orders", label: "Kitchen orders", icon: UtensilsCrossed },
  { href: "/admin/payments", label: "Payments", icon: Wallet },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side gate (Batch 6): verifies profiles.is_admin on the server,
  // not just "signed in." Redirects to /login (signed out) or /dashboard
  // (signed in but not an admin) before any admin data is fetched.
  await requireAdmin();

  return (
    <DashboardShell title="Admin" eyebrow="Blag GYM HQ" navItems={NAV}>
      {children}
    </DashboardShell>
  );
}
