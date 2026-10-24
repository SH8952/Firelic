import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd, languageAlternates, ogImages } from "@/lib/seo";
import { FIRE_TYPES } from "@/lib/fireTypes";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FireTypes" });
  const url = `${SITE_URL}/${locale}/calculators`;
  const title = t("indexTitle");
  const description = t("indexDescription");
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates("/calculators") },
    openGraph: { title, description, url, locale, type: "website", images: ogImages(locale) },
  };
}

export default async function CalculatorsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "FireTypes" });
  const tCalc = await getTranslations({ locale, namespace: "calculator" });
  const tBack = await getTranslations({ locale, namespace: "BackNav" });
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: t("indexTitle"), url: `${SITE_URL}/${locale}/calculators` },
  ]);
  const koWrap = locale === "ko" ? " [word-break:keep-all] [overflow-wrap:break-word]" : "";

  return (
    <div className={`contents${koWrap}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <BackLink href={`/${locale}`} label={tBack("home")} />
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t("indexTitle")}</h1>
        <p className="mt-3 max-w-3xl text-[var(--color-text-secondary)]">{t("indexLead")}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {FIRE_TYPES.map((type) => (
            <Link
              key={type}
              href={`/calculators/${type}`}
              className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-primary)]"
            >
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{t(`${type}.name`)}</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">{t(`${type}.short`)}</p>
              <span className="text-sm font-medium text-[var(--color-primary)]">{t("openCalculator")} →</span>
            </Link>
          ))}
        </div>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
        >
          {t("mainCalculator")} →
        </Link>
      </div>
      <DisclaimerFooter text={tCalc("disclaimer")} />
    </div>
  );
}
