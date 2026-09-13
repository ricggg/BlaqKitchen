"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { CATEGORY_LABEL, DAY_LABEL, type GymClass } from "@/lib/classes";

export default function BookingModal({
  gymClass,
  onClose,
}: {
  gymClass: GymClass;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [status, setStatus] = useState<"idle" | "booking" | "done" | "waitlisted" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const spotsLeft = gymClass.capacity - gymClass.booked;

  async function confirmBooking(joinWaitlist = false) {
    setStatus("booking");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: gymClass.id, joinWaitlist }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Show whatever the server actually rejected the booking for —
        // e.g. "You need an active membership to book a class." — instead
        // of a generic message, since these are meaningfully different
        // actions for the user (join a plan vs. pick another class).
        setErrorMessage(body?.error ?? "Couldn't confirm that booking — try again.");
        setErrorCode(body?.code ?? null);
        setStatus("error");
        return;
      }
      setStatus(body?.waitlisted ? "waitlisted" : "done");
    } catch {
      setErrorMessage("Couldn't confirm that booking — try again.");
      setErrorCode(null);
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-5"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-md rounded-t-md sm:rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[var(--color-blaze)] mb-1">{CATEGORY_LABEL[gymClass.category]}</p>
              <h3 className="font-[family-name:var(--font-display)] uppercase text-xl text-[var(--color-text)]">
                {gymClass.name}
              </h3>
            </div>
            <button onClick={onClose} aria-label="Close" className="text-[var(--color-text-faint)]">
              <X size={20} />
            </button>
          </div>

          <div className="mt-5 space-y-2 text-sm text-[var(--color-text-muted)]">
            <p>{DAY_LABEL[gymClass.dayOfWeek]} · {gymClass.startTime} · {gymClass.durationMinutes} min</p>
            <p>Coach: {gymClass.trainer}</p>
            <p>{spotsLeft} of {gymClass.capacity} spots left</p>
          </div>

          {status === "done" ? (
            <div className="mt-6 flex items-center gap-2 rounded-sm border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 px-4 py-3 text-sm text-[var(--color-success)]">
              <CalendarCheck size={18} />
              You&rsquo;re booked. See you on the floor.
            </div>
          ) : status === "waitlisted" ? (
            <div className="mt-6 flex items-center gap-2 rounded-sm border border-[var(--color-warn)]/30 bg-[var(--color-warn)]/10 px-4 py-3 text-sm text-[var(--color-warn)]">
              <CalendarCheck size={18} />
              You&rsquo;re on the waitlist. We&rsquo;ll confirm you automatically if a spot opens up.
            </div>
          ) : !user ? (
            <div className="mt-6">
              <p className="text-sm text-[var(--color-text-muted)] mb-3">
                Sign in to reserve your spot.
              </p>
              <Link
                href="/login"
                className="inline-flex w-full justify-center rounded-sm bg-[var(--color-blaze)] px-4 py-3 text-sm font-semibold text-white"
              >
                Sign in to book
              </Link>
            </div>
          ) : (
            <div className="mt-6">
              {status === "error" && (
                <p className="text-sm text-[var(--color-danger)] mb-3">{errorMessage}</p>
              )}
              {status === "error" && errorCode === "NO_MEMBERSHIP" ? (
                <Link
                  href="/membership"
                  className="inline-flex w-full justify-center rounded-sm bg-[var(--color-blaze)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--color-blaze-dark)] transition-colors"
                >
                  View memberships
                </Link>
              ) : status === "error" && errorCode === "FULL" ? (
                <button
                  onClick={() => confirmBooking(true)}
                  className="w-full rounded-sm border border-[var(--color-border-strong)] px-4 py-3 text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-blaze)] transition-colors disabled:opacity-60"
                >
                  Join waitlist
                </button>
              ) : spotsLeft <= 0 ? (
                <button
                  onClick={() => confirmBooking(true)}
                  disabled={status === "booking"}
                  className="w-full rounded-sm border border-[var(--color-border-strong)] px-4 py-3 text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-blaze)] transition-colors disabled:opacity-60"
                >
                  {status === "booking" ? "Joining…" : "Class full — join waitlist"}
                </button>
              ) : (
                <button
                  onClick={() => confirmBooking(false)}
                  disabled={status === "booking"}
                  className="w-full rounded-sm bg-[var(--color-blaze)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--color-blaze-dark)] transition-colors disabled:opacity-60"
                >
                  {status === "booking" ? "Booking…" : "Confirm booking"}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
