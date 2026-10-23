import { getTranslations } from "next-intl/server";
import { getAllGuidesMeta } from "@/lib/guides";

/**
 * 가이드 상세 하단 "관련 가이드" — 같은 카테고리의 다른 가이드를 순환 방식으로 3개 연결한다.
 * 현재 글 바로 다음 순서부터 이어 붙이므로 모든 가이드가 고르게 내부 링크를 받는다
 * (한 글에만 링크가 쏠리지 않음). 글 본문은 수정하지 않고 43편×4개 언어에 일괄 적용된다.
 * 카테고리 안의 글이 3개보다 적으면 다른 카테고리의 글로 채운다. (2026-10-23)
 */
export async function RelatedGuides({
  locale,
  slug,
  category,
  count = 3,
}: {
  locale: string;
  slug: string;
  category: string;
  count?: number;
}) {
  const t = await getTranslations({ locale, namespace: "guides" });
  const all = getAllGuidesMeta(locale).sort((a, b) => a.slug.localeCompare(b.slug));

  const pickCyclic = (pool: typeof all) => {
    const idx = pool.findIndex((g) => g.slug === slug);
    const others = pool.filter((g) => g.slug !== slug);
    if (idx === -1) return others;
    // 현재 글 다음 순서부터 시작하도록 회전
    const afterIdx = pool.slice(idx + 1).concat(pool.slice(0, idx));
    return afterIdx;
  };

  const sameCategory = pickCyclic(all.filter((g) => g.category === category || g.slug === slug));
  const rest = pickCyclic(all).filter((g) => !sameCategory.some((s) => s.slug === g.slug));
  const picks = [...sameCategory, ...rest].slice(0, count);
  if (picks.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="related-guides-title">
      <h2 id="related-guides-title" className="text-lg font-bold text-[var(--color-text-primary)]">
        {t("relatedTitle")}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {picks.map((g) => (
          <li key={g.slug}>
            <a
              href={`/${locale}/guides/${g.slug}`}
              className="flex h-full flex-col gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:border-[var(--color-primary)]"
            >
              <span className="text-xs font-medium text-[var(--color-primary)]">{g.category}</span>
              <span className="text-sm font-semibold leading-snug text-[var(--color-text-primary)]">{g.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
