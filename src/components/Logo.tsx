type LogoProps = {
  className?: string;
  showWordmark?: boolean;
};

/**
 * Official logo (v2, code-generated, 2026-11-07): a dark-emerald rounded square with an
 * ascending-trend arrow in the signature bright emerald (asset growth) and a gold
 * "spark" dot (FIRE) so the dot reads as a separate accent. Same shapes and colors as
 * src/app/icon.svg / favicon.ico (kept in sync with ExifLens / FlyDroneMap's
 * "dark tinted square + bright signature mark" favicon pattern).
 * The icon colors are fixed brand colors; the wordmark text uses the
 * theme text color so it reads correctly in dark mode.
 */
export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg
        viewBox="0 0 32 32"
        width={28}
        height={28}
        role="img"
        aria-label="FIRE Calculator"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="7" fill="#064E3B" />
        <g transform="translate(16 16) scale(1.15) translate(-16.9 -17.9)">
          <path
            d="M7 21 L13 15 L17 19 L24 10"
            stroke="#34D399"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 10 L24 15 M24 10 L19 10"
            stroke="#34D399"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="24.5" cy="23.5" r="3.6" fill="#F2C14E" />
        </g>
      </svg>
      {showWordmark && (
        <span className="text-lg font-bold text-[var(--color-text-primary)]">FIRE Calculator</span>
      )}
    </span>
  );
}
