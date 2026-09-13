export default function BlagLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Blag's Kitchen & Fitness logo"
    >
      {/* outer red ring */}
      <circle cx="60" cy="60" r="58" fill="var(--color-blaze)" />
      {/* inner black disc */}
      <circle cx="60" cy="60" r="50" fill="#0b0b0c" stroke="#2a2a2d" strokeWidth="1.5" />

      {/* crossed spatula + fork, chef-hat badge look */}
      <g transform="translate(60,44)">
        {/* left utensil (spatula) */}
        <g transform="rotate(-32)">
          <rect x="-2.2" y="-30" width="4.4" height="34" rx="2.2" fill="#e7e5df" />
          <ellipse cx="0" cy="-33" rx="7" ry="9" fill="#e7e5df" />
        </g>
        {/* right utensil (fork) */}
        <g transform="rotate(32)">
          <rect x="-2.2" y="-30" width="4.4" height="34" rx="2.2" fill="#e7e5df" />
          <path
            d="M -6 -34 L -6 -42 M -2 -34 L -2 -44 M 2 -34 L 2 -44 M 6 -34 L 6 -42 L -6 -34 Z"
            stroke="#e7e5df"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>

      {/* chef hat */}
      <g transform="translate(60,40)">
        <path
          d="M -13 8 L -13 -4 C -13 -13 -6 -18 0 -18 C 6 -18 13 -13 13 -4 L 13 8 Z"
          fill="#f4f2ec"
        />
        <ellipse cx="0" cy="-16" rx="9" ry="6" fill="#f4f2ec" />
        <ellipse cx="-9" cy="-10" rx="6" ry="5" fill="#f4f2ec" />
        <ellipse cx="9" cy="-10" rx="6" ry="5" fill="#f4f2ec" />
        <rect x="-14" y="7" width="28" height="4" rx="2" fill="#d8d5cc" />
      </g>

      {/* wordmark */}
      <text
        x="60"
        y="82"
        textAnchor="middle"
        fontFamily="var(--font-display, Arial Narrow, sans-serif)"
        fontSize="15"
        fontWeight="700"
        fill="var(--color-blaze)"
        letterSpacing="0.5"
      >
        BLAG&apos;S
      </text>
      <text
        x="60"
        y="94"
        textAnchor="middle"
        fontFamily="var(--font-body, Segoe UI, sans-serif)"
        fontSize="9"
        fontWeight="500"
        fill="#e7e5df"
        letterSpacing="1"
      >
        kitchen
      </text>
    </svg>
  );
}
