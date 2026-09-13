"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const springX = useSpring(mx, { stiffness: 80, damping: 20 });
  const springY = useSpring(my, { stiffness: 80, damping: 20 });

  const rotateX = useTransform(springY, [0, 1], [8, -8]);
  const rotateY = useTransform(springX, [0, 1], [-8, 8]);
  const glowX = useTransform(springX, [0, 1], ["20%", "80%"]);
  const glowY = useTransform(springY, [0, 1], ["10%", "70%"]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-[var(--color-bg)] pt-24 pb-16 md:pt-16 md:pb-0">
      {/* Ambient light following cursor — subtle 3D depth cue */}
      <motion.div
        className="pointer-events-none absolute -inset-40 opacity-40"
        style={{
          background: `radial-gradient(600px circle at ${glowX} ${glowY}, rgba(225,29,46,0.25), transparent 60%)`,
        }}
      />

      <div className="mx-auto max-w-7xl w-full px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm tracking-wide text-[var(--color-brass)] mb-4">
            Asaba&rsquo;s strength, food &amp; fitness club
          </p>
          <h1 className="font-[family-name:var(--font-display)] uppercase text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-[var(--color-text)] text-balance">
            Train blag.
            <br />
            Eat right.
            <br />
            <span className="text-[var(--color-blaze)]">Live strong.</span>
          </h1>
          <p className="mt-6 max-w-md text-[var(--color-text-muted)] text-base leading-relaxed">
            Strength training, HIIT, boxing and recovery — with Blags Kitchen
            next door for meals built around your program. One membership,
            one app, everything booked in seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/book"
              className="group inline-flex items-center gap-2 rounded-sm bg-[var(--color-blaze)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--color-blaze-dark)] transition-colors"
            >
              Book your first session
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/tour"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text)]"
            >
              <PlayCircle size={20} className="text-[var(--color-brass)]" />
              Watch the tour
            </Link>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-3 max-w-md gap-3 sm:gap-6 border-t border-[var(--color-border)] pt-6">
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl md:text-3xl text-[var(--color-text)] truncate">1,200+</p>
              <p className="text-[11px] sm:text-xs text-[var(--color-text-faint)] mt-1">Active members</p>
            </div>
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl md:text-3xl text-[var(--color-text)] truncate">40+</p>
              <p className="text-[11px] sm:text-xs text-[var(--color-text-faint)] mt-1">Classes weekly</p>
            </div>
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl md:text-3xl text-[var(--color-text)] truncate">05:00–23:00</p>
              <p className="text-[11px] sm:text-xs text-[var(--color-text-faint)] mt-1">Open daily</p>
            </div>
          </div>
        </motion.div>

        {/* Right: 3D tilting card stack */}
        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1200 }}
          className="relative h-[420px] sm:h-[480px] hidden md:block"
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full h-full"
          >
            <div
              style={{ transform: "translateZ(0px)" }}
              className="absolute inset-0 rounded-md overflow-hidden border border-[var(--color-border-strong)]"
            >
              <Image
                src="https://images.unsplash.com/photo-1545612036-2872840642dc?fm=jpg&q=70&w=1200&auto=format&fit=crop"
                alt="Blag's Kitchen &amp; Fitness training floor"
                fill
                sizes="(max-width: 768px) 0px, 500px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-[var(--gradient-hero-scrim)]" />
              <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(225,29,46,0.18),transparent_60%)]" />
              <div className="absolute bottom-0 inset-x-0 p-6">
                <p className="text-xs text-[var(--color-text-faint)]">This week</p>
                <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)] mt-1">
                  Strength &amp; Conditioning
                </p>
              </div>
            </div>

            <motion.div
              style={{ transform: "translateZ(60px)" }}
              className="absolute -left-6 top-10 w-52 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] p-4 shadow-2xl shadow-black/50"
            >
              <p className="text-xs text-[var(--color-text-faint)]">Next class</p>
              <p className="text-sm font-semibold text-[var(--color-text)] mt-1">Boxing Conditioning</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">6:00 AM · Coach Tega</p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--color-border)] overflow-hidden">
                <div className="h-full w-4/5 bg-[var(--color-blaze)]" />
              </div>
              <p className="text-[10px] text-[var(--color-text-faint)] mt-1">18/22 spots filled</p>
            </motion.div>

            <motion.div
              style={{ transform: "translateZ(90px)" }}
              className="absolute -right-4 bottom-8 w-48 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] p-4 shadow-2xl shadow-black/50"
            >
              <p className="text-xs text-[var(--color-brass)]">Blags Kitchen</p>
              <p className="text-sm font-semibold text-[var(--color-text)] mt-1">Post-workout bowl</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Grilled chicken · quinoa</p>
              <p className="text-sm font-semibold text-[var(--color-brass)] mt-2">₦4,500</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
