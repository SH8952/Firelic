type LogoProps = {
  className?: string;
  showWordmark?: boolean;
};

/**
 * Official logo (v1, code-generated): a green circular badge with an
 * ascending-trend arrow (asset growth) and an orange "spark" accent (FIRE),
 * per the design spec (fire-calculator-design-spec.md section 1 & 6).
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
        <circle cx="16" cy="16" r="16" fill="#1E8E5A" />
        <path
          d="M7 21 L13 15 L17 19 L24 10"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 10 L24 15 M24 10 L19 10"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24.5" cy="23.5" r="3.6" fill="#F5A623" />
      </svg>
      {showWordmark && (
        <span className="text-lg font-bold text-[var(--color-text-primary)]">FIRE Calculator</span>
      )}
    </span>
  );
}
