type AdSlotProps = {
  variant: "display" | "native";
  label: string;
};

/**
 * Placeholder ad slot. Reserves layout space (min-height) to avoid CLS.
 * Replace the inner content with the actual AdSense <ins> tag once the
 * site is approved (see web-backend follow-up: NEXT_PUBLIC_ADSENSE_PUBLISHER_ID).
 */
export function AdSlot({ variant, label }: AdSlotProps) {
  const minHeight = variant === "display" ? "min-h-[100px]" : "min-h-[90px]";
  return (
    <div
      className={`flex ${minHeight} w-full items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text-secondary)]`}
      aria-hidden="true"
      data-ad-slot={variant}
    >
      {label}
    </div>
  );
}
