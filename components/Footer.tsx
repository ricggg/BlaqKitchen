import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import BlaqLogo from "./BlaqLogo";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div>
          <span className="flex items-center gap-2.5">
            <BlaqLogo size={34} />
            <span className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text)]">
              BLAQ<span className="text-[var(--color-blaze)]">GYM</span>
            </span>
          </span>
          <p className="mt-3 text-sm text-[var(--color-text-muted)] max-w-xs leading-relaxed">
            Blaq&rsquo;s Kitchen &amp; Fitness — good food, fresh drinks and a fit
            life, all in one place.
          </p>
          <div className="mt-5 flex items-center gap-4 text-[var(--color-text-muted)]">
            <Instagram size={18} />
            <Facebook size={18} />
            <Twitter size={18} />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[var(--color-text)] mb-4">Club</p>
          <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
            <li><Link href="/classes">Classes</Link></li>
            <li><Link href="/schedule">Schedule</Link></li>
            <li><Link href="/trainers">Trainers</Link></li>
            <li><Link href="/personal-training">Personal training</Link></li>
            <li><Link href="/membership">Membership</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-[var(--color-text)] mb-4">Blaqs Kitchen</p>
          <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
            <li><Link href="/kitchen">Menu</Link></li>
            <li><Link href="/kitchen/order">Order ahead</Link></li>
            <li><Link href="/kitchen/reserve">Reserve a table</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-[var(--color-text)] mb-4">About</p>
          <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
            <li><Link href="/about">Our story</Link></li>
            <li><Link href="/facilities">Facilities</Link></li>
            <li><Link href="/transformations">Transformations</Link></li>
            <li><Link href="/locations">Locations</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-[var(--color-text)] mb-4">Visit us</p>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Along Rehoboth City Road, Church Street, Asaba
            <br />
            Open daily · 10:00 AM
            <br />
            <a href="tel:+2349166746656" className="hover:text-[var(--color-text)]">0916 674 6656</a>
            {" "}·{" "}
            <a href="tel:+2348029249765" className="hover:text-[var(--color-text)]">0802 924 9765</a>
            <br />
            Call or WhatsApp
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--color-text-faint)]">
          <p>© {new Date().getFullYear()} Blaq GYM. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
