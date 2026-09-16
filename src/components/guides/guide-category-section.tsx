"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

export interface GuideCategoryItem {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
}

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
  const [expanded, setExpanded] = useState(false);
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
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-4 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
        >
          {expanded ? collapseLabel : expandLabel}
        </button>
      ) : null}
    </section>
  );
}
