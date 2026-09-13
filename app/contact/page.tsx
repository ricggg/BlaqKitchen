"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import PageHeader from "@/components/marketing/PageHeader";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    // No backend endpoint yet — this is a front-end-only success state.
    // Wire this to a real submissions table / email service in a later batch
    // (Batch 21: Notifications, or a dedicated `contact_messages` table).
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 500);
  }

  return (
    <div className="bg-[var(--color-bg)]">
      <PageHeader eyebrow="Contact" title="Get in touch" description="Questions about membership, classes or Blags Kitchen? We're happy to help." />

      <section className="mx-auto max-w-5xl px-5 md:px-8 pb-20 grid md:grid-cols-2 gap-10">
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-5">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-[var(--color-blaze)] mt-0.5 shrink-0" />
            <p className="text-sm text-[var(--color-text-muted)]">Along Rehoboth City Road, Church Street, Asaba</p>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} className="text-[var(--color-blaze)] mt-0.5 shrink-0" />
            <p className="text-sm text-[var(--color-text-muted)]">0916 674 6656 · 0802 924 9765</p>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-[var(--color-blaze)] mt-0.5 shrink-0" />
            <p className="text-sm text-[var(--color-text-muted)]">hello@blaggym.com</p>
          </div>
        </div>

        {sent ? (
          <div className="rounded-md border border-[var(--color-success)]/40 bg-[var(--color-success)]/5 p-6 flex items-center">
            <p className="text-sm text-[var(--color-text)]">
              Thanks — your message is in. We&rsquo;ll get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              placeholder="Your name"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-blaze)]"
            />
            <input
              required
              type="email"
              placeholder="Email address"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-blaze)]"
            />
            <textarea
              required
              rows={5}
              placeholder="How can we help?"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-blaze)] resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center rounded-sm bg-[var(--color-blaze)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-blaze-dark)] transition-colors disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
