"use client";

import { useTranslations } from "next-intl";

/**
 * Textual "how to use" section on the main calculator page, placed right
 * above the bottom ad slot (per the 2026-09-01 layout request). Mirrors
 * ExifLens's src/components/home-usage-section.tsx (title + numbered
 * circle steps 1..n), adapted to firelic's CSS variable color tokens.
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
export function UsageGuideSection() {
  const t = useTranslations("calculator");
  const steps: string[] = t.raw("usageSteps");

  return (
    <section className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-10">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
        {t("usageTitle")}
      </h2>
      <ol className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-text-primary)]">
              {i + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
