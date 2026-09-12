import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import LaneDivider from "./LaneDivider";

const DISHES = [
  {
    name: "Grilled Chicken & Quinoa Bowl",
    tag: "High protein",
    price: "₦4,500",
    image: "https://images.unsplash.com/photo-1665332195309-9d75071138f0?fm=jpg&q=70&w=200&auto=format&fit=crop",
  },
  {
    name: "Lean Beef Suya Wrap",
    tag: "Post-workout",
    price: "₦3,800",
    image: "https://images.unsplash.com/photo-1767974968707-db3d448d4ef3?fm=jpg&q=70&w=200&auto=format&fit=crop",
  },
  {
    name: "Green Power Smoothie",
    tag: "Recovery",
    price: "₦2,200",
    image: "https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?fm=jpg&q=70&w=200&auto=format&fit=crop",
  },
];

export default function KitchenTeaser() {
  return (
    <section id="kitchen" className="relative bg-[var(--color-bg)]">
      <LaneDivider accent="var(--color-brass)" />
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm text-[var(--color-brass)] mb-2">Blaqs Kitchen</p>
          <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl sm:text-4xl text-[var(--color-text)] max-w-md text-balance">
            Meals built for the work you just put in
          </h2>
          <p className="mt-4 max-w-md text-[var(--color-text-muted)] leading-relaxed">
            Our in-house restaurant sits right off the training floor. Order
            ahead from your phone and it&rsquo;s ready when you&rsquo;re done —
            or reserve a table for a proper sit-down meal after your session.
          </p>
          <Link
            href="/kitchen"
            className="mt-6 inline-flex items-center gap-2 rounded-sm border border-[var(--color-brass)] px-5 py-3 text-sm font-semibold text-[var(--color-brass)] hover:bg-[var(--color-brass)] hover:text-black transition-colors"
          >
            See the full menu
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex flex-col gap-px bg-[var(--color-border)] rounded-md overflow-hidden">
          {DISHES.map((d) => (
            <div
              key={d.name}
              className="bg-[var(--color-surface)] px-6 py-5 flex items-center gap-4"
            >
              <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)]">
                <Image src={d.image} alt={d.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--color-text)] truncate">{d.name}</p>
                <p className="text-xs text-[var(--color-text-faint)] mt-1">{d.tag}</p>
              </div>
              <p className="text-sm font-semibold text-[var(--color-brass)] shrink-0">{d.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
