export default function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <section className="bg-[var(--color-bg)] pt-32 pb-14 md:pt-40">
      <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
        <p className="text-sm text-[var(--color-blaze)] mb-3">{eyebrow}</p>
        <h1 className="font-[family-name:var(--font-display)] uppercase text-4xl sm:text-5xl text-[var(--color-text)] text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-xl mx-auto text-[var(--color-text-muted)] leading-relaxed">{description}</p>
        )}
      </div>
    </section>
  );
}
