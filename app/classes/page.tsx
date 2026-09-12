import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Dumbbell, Flame, HeartPulse, Users } from "lucide-react";
import PageHeader from "@/components/marketing/PageHeader";
import FinalCTA from "@/components/marketing/FinalCTA";

const PROGRAMS = [
  {
    icon: Dumbbell,
    name: "Strength & Powerlifting",
    desc: "Progressive overload programming with certified coaches watching every rep — squat, bench, deadlift and accessory work.",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?fm=jpg&q=70&w=900&auto=format&fit=crop",
  },
  {
    icon: Flame,
    name: "HIIT & Conditioning",
    desc: "45-minute high-intensity circuits built to torch fat and build engine, mixing bodyweight, kettlebells and sleds.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?fm=jpg&q=70&w=900&auto=format&fit=crop",
  },
  {
    icon: Users,
    name: "Boxing & Combat Fit",
    desc: "Pad work, bag rounds and footwork drills for every skill level, from first-timers to competitive sparring partners.",
    image: "https://images.unsplash.com/photo-1633394782368-6e7260566004?fm=jpg&q=70&w=900&auto=format&fit=crop",
  },
  {
    icon: HeartPulse,
    name: "Recovery & Mobility",
    desc: "Guided stretching, massage gun stations and sauna recovery sessions to keep you training injury-free.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?fm=jpg&q=70&w=900&auto=format&fit=crop",
  },
];

export default function ClassesPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      <PageHeader
        eyebrow="Classes"
        title="Four ways to train, one membership"
        description="Every program is coached, not just supervised. Pick the one that fits your goal — or mix all four across the week."
      />

      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-20">
        <div className="grid sm:grid-cols-2 gap-6">
          {PROGRAMS.map((p) => (
            <div key={p.name} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
              <div className="relative h-56 w-full">
                <Image src={p.image} alt={p.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] to-transparent" />
              </div>
              <div className="p-6">
                <p.icon size={22} className="text-[var(--color-blaze)]" />
                <h3 className="mt-4 font-medium text-lg text-[var(--color-text)]">{p.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/schedule"
            className="group inline-flex items-center gap-2 rounded-sm bg-[var(--color-blaze)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--color-blaze-dark)] transition-colors"
          >
            See this week&rsquo;s schedule
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
