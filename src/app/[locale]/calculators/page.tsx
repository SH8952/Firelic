import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { Link } from "@/i18n/navigation";
import { REFERENCE_TABLES, TABLE_KEY } from "@/lib/referenceTables";
import { breadcrumbJsonLd, languageAlternates, ogImages } from "@/lib/seo";
import { FIRE_TYPES } from "@/lib/fireTypes";

const KO_LIFE_TOOLS = [
  {
    href: "/ko/tools/emergency-fund",
    name: "비상금 목표 계산기",
    when: "월급이 끊겨도 버틸 돈이 얼마인지 모르겠을 때",
    how: "직업 형태와 위험 요인을 고르면 필요한 개월 수와 도달 시점을 알려 줍니다.",
  },
  {
    href: "/ko/tools/monthly-saving-goal",
    name: "목표 금액 역산 계산기",
    when: "‘1억을 언제까지’처럼 목표가 먼저 있을 때",
    how: "필요한 월 저축액과, 기간·수익률을 바꿨을 때의 비교표를 보여 줍니다.",
  },
  {
    href: "/ko/tools/compound-interest",
    name: "복리 계산기",
    when: "오래 투자하면 정말 불어나는지 눈으로 확인하고 싶을 때",
    how: "원금·적립·수익이 쌓이는 모습을 그래프와 연도별 표로 보여 줍니다.",
  },
  {
    href: "/ko/tools/severance-pay",
    name: "퇴직금 계산기",
    when: "퇴사나 이직을 앞두고 받을 돈을 미리 알고 싶을 때",
    how: "평균임금 계산을 단계별로 보여 주고, 받은 뒤의 활용 차이도 비교합니다.",
  },
];

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
  const tRef = await getTranslations({ locale, namespace: "Reference" });
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
        {locale === "ko" ? (
          <h2 className="mt-8 text-lg font-semibold text-[var(--color-primary)]">FIRE 유형별 계산기</h2>
        ) : null}
        <div className={`${locale === "ko" ? "mt-4" : "mt-8"} grid gap-4 sm:grid-cols-2`}>
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
        {locale === "ko" ? (
          <>
            <h2 className="mt-10 text-lg font-semibold text-[var(--color-primary)]">생활 재무 도구</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              FIRE를 준비하는 길에서 자주 막히는 작은 질문들을 하나씩 풀어 주는 도구입니다. 입력값은 브라우저 안에서만 계산됩니다.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {KO_LIFE_TOOLS.map((tool) => (
                <a
                  key={tool.href}
                  href={tool.href}
                  className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-primary)]"
                >
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{tool.name}</h3>
                  <p className="text-xs font-medium text-[var(--color-primary)]">{tool.when}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{tool.how}</p>
                  <span className="text-sm font-medium text-[var(--color-primary)]">계산해 보기 →</span>
                </a>
              ))}
            </div>
          </>
        ) : null}
        <h2 className="mt-10 text-lg font-semibold text-[var(--color-text-primary)]">{tRef("sectionRelated")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {REFERENCE_TABLES.map((table) => (
            <Link
              key={table}
              href={`/reference/${table}`}
              className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-primary)]"
            >
              <span className="font-semibold text-[var(--color-text-primary)]">{tRef(`${TABLE_KEY[table]}.h1`)}</span>
              <span className="text-sm text-[var(--color-text-secondary)]">{tRef(`${TABLE_KEY[table]}.short`)}</span>
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
