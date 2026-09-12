export default function LaneDivider({
  flip = false,
  accent = "var(--color-blaze)",
}: {
  flip?: boolean;
  accent?: string;
}) {
  return (
    <div className={`lane-divider ${flip ? "rotate-180" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1200 64" preserveAspectRatio="none">
        <polygon points="0,64 1200,0 1200,8 0,72" fill="var(--color-surface)" />
        <polygon points="0,64 400,0 420,0 20,64" fill={accent} opacity="0.5" />
        <polygon points="480,64 860,0 880,0 500,64" fill={accent} opacity="0.25" />
      </svg>
    </div>
  );
}
