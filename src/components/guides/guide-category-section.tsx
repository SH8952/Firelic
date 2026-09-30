"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

export interface GuideCategoryItem {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
}

// Runs before the browser paints on the client (so a restored "expanded"
// state never flashes as collapsed first), but falls back to useEffect on the
// server where useLayoutEffect isn't available.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Remembers which category sections the visitor expanded, for this browser
// tab only (sessionStorage), so pressing Back from a guide returns to the
// same expanded list instead of resetting to the collapsed one.
const EXPANDED_STORAGE_PREFIX = "guides-expanded:";

interface GuideCategorySectionProps {
  categoryLabel: string;
  items: GuideCategoryItem[];
  expandLabel: string;
  collapseLabel: string;
  readMoreLabel: string;
  initialVisibleCount?: number;
}

export function GuideCategorySection({
  categoryLabel,
  items,
  expandLabel,
  collapseLabel,
  readMoreLabel,
  initialVisibleCount = 4,
}: GuideCategorySectionProps) {
  const storageKey = `${EXPANDED_STORAGE_PREFIX}${categoryLabel}`;
  const [expanded, setExpanded] = useState(false);

  useIsomorphicLayoutEffect(() => {
    try {
      if (window.sessionStorage.getItem(storageKey) === "1") {
        setExpanded(true);
      }
    } catch {
      // sessionStorage unavailable (private mode etc.) — stay collapsed.
    }
  }, [storageKey]);

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    try {
      if (next) {
        window.sessionStorage.setItem(storageKey, "1");
      } else {
        window.sessionStorage.removeItem(storageKey);
      }
    } catch {
      // Ignore storage errors — the toggle still works for this visit.
    }
  };
  const hasMore = items.length > initialVisibleCount;
  const visibleItems = expanded ? items : items.slice(0, initialVisibleCount);

  return (
    <section>
      <h2 className="text-lg font-semibold text-[var(--color-primary)]">{categoryLabel}</h2>
      <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {visibleItems.map((item) => (
          <li key={item.slug} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <Link
              href={`/guides/${item.slug}`}
              className="text-base font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
            >
              {item.title}
            </Link>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{item.publishedAt}</p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{item.description}</p>
            <Link href={`/guides/${item.slug}`} className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)]">
              {readMoreLabel} →
            </Link>
          </li>
        ))}
      </ul>
      {hasMore ? (
        <button
          type="button"
          onClick={toggleExpanded}
          className="mt-4 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
        >
          {expanded ? collapseLabel : expandLabel}
        </button>
      ) : null}
    </section>
  );
}
