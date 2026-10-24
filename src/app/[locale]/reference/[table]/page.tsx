import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { AdSlot } from "@/components/AdSlot";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getGuideMeta } from "@/lib/guides";
import { formatNum } from "@/lib/formatNum";
import { breadcrumbJsonLd, languageAlternates, ogImages } from "@/lib/seo";
import {
  LOCALE_MONEY,
  REAL_RETURNS,
  REFERENCE_TABLES,
  SAVINGS_RATES,
  SAVINGS_TABLE_SWR,
  TABLE_KEY,
  WITHDRAWAL_RATES,
  fireNumber,
  formatMoney,
  isReferenceTable,
  yearsToFire,
  type ReferenceTable,
} from "@/lib/referenceTables";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

const RELATED_GUIDES: Record<ReferenceTable, string[]> = {
  "fire-number-by-spending": ["4-percent-rule-safe-withdrawal-rate", "what-is-fire"],
  "years-to-fire-by-savings-rate": ["how-to-calculate-your-savings-rate", "increase-savings-rate-practical-tips"],
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => REFERENCE_TABLES.map((table) => ({ locale, table })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; table: string }>;
}): Promise<Metadata> {
  const { locale, table } = await params;
  if (!isReferenceTable(table)) return {};
  const t = await getTranslations({ locale, namespace: "Reference" });
  const key = TABLE_KEY[table];
  const url = `${SITE_URL}/${locale}/reference/${table}`;
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(`/reference/${table}`) },
    openGraph: { title, description, url, locale, type: "website", images: ogImages(locale) },
    twitter: { card: "summary_large_image", title, description, images: [ogImages(locale)[0].url] },
  };
}

export default async function ReferenceTablePage({ params }: { params: Promise<{ locale: string; table: string }> }) {
  const { locale, table } = await params;
  if (!isReferenceTable(table)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Reference" });
  const tCalc = await getTranslations({ locale, namespace: "calculator" });
  const tBack = await getTranslations({ locale, namespace: "BackNav" });
  const key = TABLE_KEY[table];
  const otherTable = REFERENCE_TABLES.find((x) => x !== table) as ReferenceTable;
  const otherKey = TABLE_KEY[otherTable];

  const how = t.raw(`${key}.how`) as string[];
  const faq = t.raw(`${key}.faq`) as { question: string; answer: string }[];
  const url = `${SITE_URL}/${locale}/reference/${table}`;
  const money = LOCALE_MONEY[locale] ?? LOCALE_MONEY.en;
  const guides = RELATED_GUIDES[table]
    .map((slug) => getGuideMeta(locale, slug))
    .filter((g): g is NonNullable<typeof g> => g !== null);

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", url: `${SITE_URL}/${locale}` },
      { name: t(`${key}.h1`), url },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  const koWrap = locale === "ko" ? " [word-break:keep-all] [overflow-wrap:break-word]" : "";
  const h2 = "text-xl font-semibold text-[var(--color-text-primary)]";
  const body = "mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]";
  const th = "tabular-nums border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-xs font-semibold text-[var(--color-text-primary)]";
  const td = "tabular-nums border border-[var(--color-border)] p-2 text-[var(--color-text-primary)]";

  return (
    <div className={`contents${koWrap}`}>
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}
      <div className="mx-auto max-w-5xl px-4 py-10">
        <BackLink href={`/${locale}`} label={tBack("home")} />
        <header className="mb-6 max-w-3xl">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">{t(`${key}.h1`)}</h1>
          <p className="mt-3 text-[var(--color-text-secondary)]">{t(`${key}.lead`)}</p>
        </header>

        <div className="overflow-x-auto">
          {table === "fire-number-by-spending" ? (
            <table className="w-full min-w-[520px] border-collapse text-center text-sm">
              <caption className="mb-2 text-left text-sm text-[var(--color-text-secondary)]">{t("spending.caption")}</caption>
              <thead>
                <tr>
                  <th scope="col" className={`${th} text-left`}>{t("spending.rowHead")}</th>
                  {WITHDRAWAL_RATES.map((r) => (
                    <th key={r} scope="col" className={th}>{t("spending.colHead", { rate: formatNum(r, locale) })}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {money.monthly.map((m) => (
                  <tr key={m}>
                    <th scope="row" className={`${th} text-left`}>{formatMoney(m, locale, money.code)}</th>
                    {WITHDRAWAL_RATES.map((r) => (
                      <td key={r} className={`${td} ${r === 4 ? "bg-[var(--color-accent)]/20 font-semibold" : ""}`}>
                        {formatMoney(fireNumber(m, r), locale, money.code)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[520px] border-collapse text-center text-sm">
              <caption className="mb-2 text-left text-sm text-[var(--color-text-secondary)]">{t("savings.caption")}</caption>
              <thead>
                <tr>
                  <th scope="col" className={`${th} text-left`}>{t("savings.rowHead")}</th>
                  {REAL_RETURNS.map((r) => (
                    <th key={r} scope="col" className={th}>{t("savings.colHead", { rate: formatNum(r, locale) })}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAVINGS_RATES.map((s) => (
                  <tr key={s}>
                    <th scope="row" className={`${th} text-left`}>{s}%</th>
                    {REAL_RETURNS.map((r) => (
                      <td key={r} className={`${td} ${r === 5 ? "bg-[var(--color-accent)]/20 font-semibold" : ""}`}>
                        {t("savings.cell", { years: formatNum(yearsToFire(s, r, SAVINGS_TABLE_SWR), locale, 1, 1) })}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">{t(`${key}.note`)}</p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-block rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {t("openCalculator")} →
          </Link>
        </div>

        <div className="mt-12 grid gap-10 border-t border-[var(--color-border)] pt-10 lg:grid-cols-2">
          <section>
            <h2 className={h2}>{t("sectionHow")}</h2>
            {how.map((p, i) => (
              <p key={i} className={body}>{p}</p>
            ))}
          </section>
          <section>
            <h2 className={h2}>{t("sectionFormula")}</h2>
            <p className="mt-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text-primary)]">
              {t(`${key}.formula`)}
            </p>
            <p className={body}>{t(`${key}.assumptions`)}</p>
          </section>
        </div>

        <section className="mt-10 max-w-3xl">
          <h2 className={h2}>{t("sectionFaq")}</h2>
          <dl className="mt-4 flex flex-col gap-4">
            {faq.map((f) => (
              <div key={f.question} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <dt className="font-semibold text-[var(--color-text-primary)]">{f.question}</dt>
                <dd className={body}>{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10 border-t border-[var(--color-border)] pt-10">
          <h2 className={h2}>{t("sectionRelated")}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href={`/reference/${otherTable}`}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-primary)]"
            >
              <span className="font-semibold text-[var(--color-text-primary)]">{t(`${otherKey}.h1`)}</span>
              <span className="mt-1 block text-sm text-[var(--color-text-secondary)]">{t(`${otherKey}.short`)}</span>
            </Link>
            <Link
              href="/calculators"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-primary)]"
            >
              <span className="font-semibold text-[var(--color-text-primary)]">{t("typeCalculators")}</span>
              <span className="mt-1 block text-sm text-[var(--color-text-secondary)]">{t("typeCalculatorsShort")}</span>
            </Link>
          </div>
          {guides.length > 0 ? (
            <>
              <h3 className="mt-8 text-base font-semibold text-[var(--color-text-primary)]">{t("sectionGuides")}</h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guides/${g.slug}`} className="text-[var(--color-primary)] hover:underline">
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
        <div className="mt-8">
          <AdSlot variant="display" label={tCalc("adDisplay")} />
        </div>
      </div>
      <DisclaimerFooter text={tCalc("disclaimer")} />
    </div>
  );
}
