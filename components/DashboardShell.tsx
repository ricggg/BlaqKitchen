"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export default function DashboardShell({
  title,
  eyebrow,
  navItems,
  children,
}: {
  title: string;
  eyebrow: string;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <section className="min-h-[100svh] bg-[var(--color-bg)] pt-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-10 grid lg:grid-cols-[220px_1fr] gap-10">
        <aside className="lg:sticky lg:top-24 h-fit">
          <p className="text-xs text-[var(--color-blaze)] mb-1">{eyebrow}</p>
          <h1 className="font-[family-name:var(--font-display)] uppercase text-xl text-[var(--color-text)] mb-6">
            {title}
          </h1>
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
                    active
                      ? "bg-[var(--color-surface-elevated)] text-[var(--color-text)] border border-[var(--color-border-strong)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
