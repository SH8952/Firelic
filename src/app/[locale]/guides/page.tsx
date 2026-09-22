import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { GuideCategorySection } from "@/components/guides/guide-category-section";
import { getGuidesByCategory } from "@/lib/guides";
import { breadcrumbJsonLd } from "@/lib/seo";

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
    alternates: { canonical: url },
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
