type AdSlotProps = {
  variant: "display" | "native";
  label: string;
};

/**
 * Placeholder ad slot. Reserves layout space (min-height) to avoid CLS.
 * Replace the inner content with the actual AdSense <ins> tag once the
 * site is approved (see web-backend follow-up: NEXT_PUBLIC_ADSENSE_PUBLISHER_ID).
 *
 * [2026-09-13] AdSense가 아직 승인 전 상태라, 빈 광고 placeholder 박스가
 * 그대로 노출되면 심사 로봇이 "준비되지 않은 사이트"로 판단할 위험이 있어
 * 임시로 아무것도 렌더링하지 않도록 함. 승인 후 아래 상수만 true로 바꾸면
 * 원래대로 복원됨(호출부 코드는 전혀 변경하지 않음).
 */
const ADSENSE_APPROVED = false;

export function AdSlot({ variant, label }: AdSlotProps) {
  if (!ADSENSE_APPROVED) return null;

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
