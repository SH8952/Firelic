import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { getYearEndGuides } from "@/lib/guides";
import { breadcrumbJsonLd, languageAlternates, ogImages } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

// 연말정산 섹션은 한국어 전용이다. 다른 언어 주소는 만들지 않는다(404).
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "ko" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ko") return {};
  const t = await getTranslations({ locale, namespace: "yearEnd" });
  const url = `${SITE_URL}/${locale}/year-end-tax`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: url, languages: languageAlternates("/year-end-tax", ["ko"]) },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url,
      type: "website",
      images: ogImages(locale),
    },
  };
}

export default async function YearEndTaxHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "ko") notFound();
  setRequestLocale(locale);
  const t = await getTranslations("yearEnd");
  const tBack = await getTranslations("BackNav");
  const guides = getYearEndGuides(locale);
  const timeline = t.raw("timeline") as { when: string; text: string }[];
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: t("title"), url: `${SITE_URL}/${locale}/year-end-tax` },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 [word-break:keep-all] [overflow-wrap:break-word]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <BackLink href={`/${locale}`} label={tBack("home")} />
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t("title")}</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{t("intro")}</p>

      <a
        href={`/${locale}/year-end-tax/calculator`}
        className="mt-6 flex flex-col gap-1 rounded-xl border border-[var(--color-primary)] bg-[var(--color-surface)] p-5 hover:bg-[var(--color-primary)]/5"
      >
        <span className="text-sm font-semibold text-[var(--color-primary)]">연말정산 환급 계산기</span>
        <span className="text-sm text-[var(--color-text-secondary)]">
          총급여와 카드·연금·월세를 넣으면 예상 환급액을 계산하고, 12월에 연금계좌를 더 넣거나 카드 결제 수단을 바꿨을 때 환급이 얼마나 늘어나는지 바로 비교합니다.
        </span>
      </a>

      <div className="mt-6 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 p-5">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{t("timelineTitle")}</p>
        <ol className="mt-3 flex flex-col gap-3 text-sm">
          {timeline.map((step) => (
            <li key={step.when} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
              <span className="shrink-0 font-semibold text-[var(--color-primary)] sm:w-24">{step.when}</span>
              <span className="text-[var(--color-text-secondary)]">{step.text}</span>
            </li>
          ))}
        </ol>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--color-primary)]">{t("guidesTitle")}</h2>
        {guides.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">{t("empty")}</p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {guides.map((g) => (
              <li key={g.slug} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <a
                  href={`/${locale}/guides/${g.slug}`}
                  className="text-base font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
                >
                  {g.title}
                </a>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{g.publishedAt}</p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{g.description}</p>
                <a
                  href={`/${locale}/guides/${g.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)]"
                >
                  {t("readMore")} →
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{t("calcTitle")}</p>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t("calcText")}</p>
        <a href={`/${locale}`} className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)]">
          {t("calcLink")} →
        </a>
      </div>
    </div>
  );
}
