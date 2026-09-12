"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

// Sticky mobile bottom CTA (Batch 7 premium UX). Hidden on dashboard/admin,
// where the shell already has its own navigation.
export default function MobileBookCTA() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/95 to-transparent">
      <Link
        href="/schedule"
        className="flex items-center justify-center gap-2 w-full rounded-sm bg-[var(--color-blaze)] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/40"
      >
        Book a session <ArrowRight size={16} />
      </Link>
    </div>
  );
}
