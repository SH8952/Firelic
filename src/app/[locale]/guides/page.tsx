import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { GuideCategorySection } from "@/components/guides/guide-category-section";
import { getGuidesByCategory } from "@/lib/guides";
import { breadcrumbJsonLd, languageAlternates } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guides" });
  const url = `${SITE_URL}/${locale}/guides`;

  return {
    title: t("title"),
    alternates: { canonical: url, languages: languageAlternates("/guides") },
    openGraph: { title: t("title"), url, type: "website" },
  };
}

export default async function GuidesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guides");
  const categories = getGuidesByCategory(locale);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: t("title"), url: `${SITE_URL}/${locale}/guides` },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t("title")}</h1>

      <div className="mt-6 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 p-5">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{t("journeyTitle")}</p>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t("journeyIntro")}</p>
        <ol className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-3">
          <li>
            <a
              href={`/${locale}/guides/what-is-fire`}
              className="inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
            >
              {t("journeyStep1")}
            </a>
          </li>
          <li>
            <a
              href={`/${locale}/guides/how-to-calculate-your-savings-rate`}
              className="inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
            >
              {t("journeyStep2")}
            </a>
          </li>
          <li>
            <a
              href={`/${locale}/guides/index-fund-investing-for-fire`}
              className="inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
            >
              {t("journeyStep3")}
            </a>
          </li>
          <li>
            <a
              href={`/${locale}/guides/4-percent-rule-safe-withdrawal-rate`}
              className="inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
            >
              {t("journeyStep4")}
            </a>
          </li>
        </ol>
      </div>

      {categories.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-text-secondary)]">{t("empty")}</p>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          {categories.map(({ category, guides }) => (
            <GuideCategorySection
              key={category}
              categoryLabel={category}
              expandLabel={t("showMore")}
              collapseLabel={t("showLess")}
              readMoreLabel={t("readMore")}
              items={guides.map((g) => ({
                slug: g.slug,
                title: g.title,
                description: g.description,
                publishedAt: g.publishedAt,
              }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
