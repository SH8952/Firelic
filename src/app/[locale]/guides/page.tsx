import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { GuideCategorySection } from "@/components/guides/guide-category-section";
import { getGuidesByCategory } from "@/lib/guides";
import { breadcrumbJsonLd, languageAlternates, ogImages } from "@/lib/seo";
import { BackLink } from "@/components/back-link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guides" });
  const tSeo = await getTranslations({ locale, namespace: "Seo" });
  const url = `${SITE_URL}/${locale}/guides`;
  const description = tSeo("guidesDescription");

  return {
    title: t("title"),
    description,
    alternates: { canonical: url, languages: languageAlternates("/guides") },
    openGraph: { title: t("title"), description, url, type: "website", images: ogImages(locale) },
  };
}

export default async function GuidesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guides");
  const tBack = await getTranslations("BackNav");
  const categories = getGuidesByCategory(locale);
  const journeySteps: { label: string; slug: string }[] = t.has("journeySteps")
    ? (t.raw("journeySteps") as { label: string; slug: string }[])
    : [
        { label: t("journeyStep1"), slug: "what-is-fire" },
        { label: t("journeyStep2"), slug: "how-to-calculate-your-savings-rate" },
        { label: t("journeyStep3"), slug: "index-fund-investing-for-fire" },
        { label: t("journeyStep4"), slug: "4-percent-rule-safe-withdrawal-rate" },
      ];
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
      <BackLink href={`/${locale}`} label={tBack("home")} />
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t("title")}</h1>

      <div className="mt-6 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 p-5">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{t("journeyTitle")}</p>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t("journeyIntro")}</p>
        <ol className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-3">
          {journeySteps.map((step) => (
            <li key={step.slug}>
              <a
                href={`/${locale}/guides/${step.slug}`}
                className="inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
              >
                {step.label}
              </a>
            </li>
          ))}
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
