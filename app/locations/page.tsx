import { MapPin, Phone, Clock } from "lucide-react";
import PageHeader from "@/components/marketing/PageHeader";
import FinalCTA from "@/components/marketing/FinalCTA";

export default function LocationsPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      <PageHeader eyebrow="Visit us" title="Find Blag GYM" />

      <section className="mx-auto max-w-4xl px-5 md:px-8 pb-20">
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-8 grid sm:grid-cols-3 gap-8">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-[var(--color-blaze)] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Address</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Along Rehoboth City Road, Church Street, Asaba
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-[var(--color-blaze)] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Hours</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Open daily · 05:00–23:00</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} className="text-[var(--color-blaze)] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Call / WhatsApp</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                <a href="tel:+2349166746656" className="hover:text-[var(--color-text)]">0916 674 6656</a>
                <br />
                <a href="tel:+2348029249765" className="hover:text-[var(--color-text)]">0802 924 9765</a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-md border border-[var(--color-border)] overflow-hidden h-80">
          <iframe
            title="Blag GYM location"
            className="w-full h-full grayscale contrast-125 opacity-90"
            loading="lazy"
            src="https://www.google.com/maps?q=Church+Street,+Asaba,+Nigeria&output=embed"
          />
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
