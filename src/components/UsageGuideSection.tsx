"use client";

import { useTranslations } from "next-intl";
import { Check, LineChart, Shield, SlidersHorizontal, SplitSquareHorizontal, type LucideIcon } from "lucide-react";

/**
 * Textual "how to use" section on the main calculator page, placed right
 * above the bottom ad slot (per the 2026-09-01 layout request). Mirrors
 * ExifLens's src/components/home-usage-section.tsx (icon cards) and
 * home-trust-badges.tsx (trust badge row), adapted to firelic's CSS
 * variable color tokens and single-step-string content (no title/body
 * split — firelic's usageSteps stayed plain strings, 2026-10-09 card
 * restyle only changes the presentation, not the copy).
 *
 * Rendered from FireCalculator.tsx, which is itself a client component
 * ("use client", since it holds slider/scenario state) — so this uses
 * the client-side `useTranslations` hook rather than ExifLens's async
 * server-side `getTranslations` (a Server Component can't be imported
 * and instantiated directly inside a Client Component's own tree).
 *
 * Also gives search engines real, crawlable prose describing the tool,
 * since the calculator UI itself is interactive and not text content.
 */

// 단계 순서(messages `calculator.usageSteps`)와 같은 순서의 장식용 아이콘.
// 단계가 더 늘어나면 마지막 아이콘을 재사용한다. 문구는 건드리지 않는다.
const STEP_ICONS: LucideIcon[] = [SlidersHorizontal, LineChart, SplitSquareHorizontal, Shield];

export function UsageGuideSection() {
  const t = useTranslations("calculator");
  const steps: string[] = t.raw("usageSteps");
  const badges: string[] = t.raw("trustBadges");

  return (
    <section className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          {t("usageTitle")}
        </h2>
        {Array.isArray(badges) && badges.length > 0 ? (
          <ul className="flex flex-wrap justify-center gap-2">
            {badges.map((badge, index) => (
              <li
                key={badge}
                className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-text-secondary)] ${
                  // 모바일에서 한 줄에 들어가도록 마지막(가장 덜 중요한) 배지는 sm 미만에서 숨김
                  index === badges.length - 1 ? "max-sm:hidden" : ""
                }`.trim()}
              >
                <Check aria-hidden="true" className="size-3.5 text-[var(--color-primary)]" />
                {badge}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <ol className="grid gap-4 sm:grid-cols-2">
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[Math.min(i, STEP_ICONS.length - 1)];
          return (
            <li
              key={i}
              className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="flex size-9 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                >
                  <Icon className="size-5" />
                </span>
                <span className="text-xs font-semibold tabular-nums text-[var(--color-text-secondary)]">
                  {i + 1}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{step}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
