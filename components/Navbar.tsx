"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, User, ShoppingBag } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import BlaqLogo from "./BlaqLogo";

const LINKS = [
  { href: "/classes", label: "Classes" },
  { href: "/schedule", label: "Schedule" },
  { href: "/kitchen", label: "Blaqs Kitchen" },
  { href: "/membership", label: "Membership" },
  { href: "/trainers", label: "Trainers" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { count, toggle } = useCart();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[var(--color-bg)]/90 backdrop-blur border-b border-[var(--color-border)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <BlaqLogo size={36} />
          <span
            className="font-[family-name:var(--font-display)] text-xl tracking-wide text-[var(--color-text)]"
          >
            BLAQ<span className="text-[var(--color-blaze)]">GYM</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <User size={16} />
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Sign in
            </Link>
          )}
          <button
            onClick={toggle}
            aria-label="Open cart"
            className="relative text-[var(--color-text-muted)] hover:text-[var(--color-brass)] transition-colors"
          >
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-[var(--color-brass)] text-black text-[10px] font-bold w-4 h-4">
                {count}
              </span>
            )}
          </button>
          <Link
            href="/schedule"
            className="inline-flex items-center rounded-sm bg-[var(--color-blaze)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-blaze-dark)] transition-colors"
          >
            Book a session
          </Link>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden p-2 text-[var(--color-text)]"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[var(--color-bg)] border-t border-[var(--color-border)] px-5 py-4 flex flex-col gap-4">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-base text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <Link href={user ? "/dashboard" : "/login"} className="text-sm text-[var(--color-text-muted)]">
              {user ? "Dashboard" : "Sign in"}
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                toggle();
              }}
              className="relative flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]"
            >
              <ShoppingBag size={16} />
              Cart{count > 0 ? ` (${count})` : ""}
            </button>
            <Link
              href="/schedule"
              className="inline-flex items-center rounded-sm bg-[var(--color-blaze)] px-4 py-2 text-sm font-semibold text-white"
            >
              Book a session
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
