import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { FireTypeCalculator } from "@/components/FireTypeCalculator";
import { AdSlot } from "@/components/AdSlot";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getGuideMeta } from "@/lib/guides";
import { breadcrumbJsonLd, languageAlternates, ogImages } from "@/lib/seo";
import { FIRE_TYPES, isFireType, type FireType } from "@/lib/fireTypes";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

// 유형별로 이어서 읽을 가이드(모든 언어에 같은 슬러그가 있는 글만 사용)
const RELATED_GUIDES: Record<FireType, string[]> = {
  "coast-fire": ["coast-lean-fat-fire-explained", "what-is-fire", "how-inflation-affects-your-fire-number"],
  "barista-fire": ["barista-fire-part-time-work", "coast-lean-fat-fire-explained", "4-percent-rule-safe-withdrawal-rate"],
  "lean-fire": ["coast-lean-fat-fire-explained", "4-percent-rule-safe-withdrawal-rate", "increase-savings-rate-practical-tips"],
  "fat-fire": ["coast-lean-fat-fire-explained", "4-percent-rule-safe-withdrawal-rate", "sequence-of-returns-risk"],
};

// 유형별 보강 블록(2026-11-26): 네 유형 페이지가 같은 틀로 보이지 않도록 형태(표·비교 카드·번호 목록·서술)와
// 위치(계산기 바로 아래·두 칸 블록 뒤·왼쪽 칸 안·FAQ 뒤)를 유형마다 다르게 둔다.
// 번역은 서버 전용 네임스페이스 FireTypesExtra(브라우저로 전달하지 않음)에 있고, 해당 언어에 없으면 아무것도 그리지 않는다.
type ExtraBlock = {
  kind: "table" | "compare" | "steps" | "story";
  position: "top" | "mid" | "col" | "late";
  heading: string;
  intro?: string;
  columns?: string[];
  rows?: string[][];
  cards?: { label: string; value: string; detail: string }[];
  steps?: string[];
  paragraphs?: string[];
  note?: string;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => FIRE_TYPES.map((type) => ({ locale, type })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}): Promise<Metadata> {
  const { locale, type } = await params;
  if (!isFireType(type)) return {};
  const t = await getTranslations({ locale, namespace: "FireTypes" });
  const url = `${SITE_URL}/${locale}/calculators/${type}`;
  const title = t(`${type}.title`);
  const description = t(`${type}.description`);
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(`/calculators/${type}`) },
    openGraph: { title, description, url, locale, type: "website", images: ogImages(locale) },
    twitter: { card: "summary_large_image", title, description, images: [ogImages(locale)[0].url] },
  };
}

export default async function FireTypePage({ params }: { params: Promise<{ locale: string; type: string }> }) {
  const { locale, type } = await params;
  if (!isFireType(type)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "FireTypes" });
  const tCalc = await getTranslations({ locale, namespace: "calculator" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const allMessages = (await getMessages({ locale })) as Record<string, unknown>;
  const extra =
    ((allMessages.FireTypesExtra as Record<string, ExtraBlock> | undefined)?.[type] as ExtraBlock | undefined) ?? null;

  const how = t.raw(`${type}.how`) as string[];
  const faq = t.raw(`${type}.faq`) as { question: string; answer: string }[];
  const url = `${SITE_URL}/${locale}/calculators/${type}`;
  const guides = RELATED_GUIDES[type]
    .map((slug) => getGuideMeta(locale, slug))
    .filter((g): g is NonNullable<typeof g> => g !== null);
  const otherTypes = FIRE_TYPES.filter((x) => x !== type);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: t(`${type}.h1`),
      url,
      description: t(`${type}.description`),
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      inLanguage: locale,
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    breadcrumbJsonLd([
      { name: "Home", url: `${SITE_URL}/${locale}` },
      { name: tNav("calculators"), url: `${SITE_URL}/${locale}/calculators` },
      { name: t(`${type}.name`), url },
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

  const renderExtra = (e: ExtraBlock, asH3: boolean) => {
    const Heading = asH3 ? "h3" : "h2";
    const headingClass = asH3 ? "mt-5 text-base font-semibold text-[var(--color-text-primary)]" : h2;
    return (
      <>
        <Heading className={headingClass}>{e.heading}</Heading>
        {e.intro ? <p className={body}>{e.intro}</p> : null}
        {e.kind === "table" && e.columns && e.rows ? (
          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-surface)] text-[var(--color-text-primary)]">
                <tr>
                  {e.columns.map((c) => (
                    <th key={c} scope="col" className="px-4 py-2 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[var(--color-text-secondary)]">
                {e.rows.map((r) => (
                  <tr key={r[0]} className="border-t border-[var(--color-border)]">
                    {r.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {e.kind === "compare" && e.cards ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {e.cards.map((c) => (
              <div key={c.label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <span className="text-sm text-[var(--color-text-secondary)]">{c.label}</span>
                <span className="mt-1 block text-2xl font-bold text-[var(--color-text-primary)]">{c.value}</span>
                <span className="mt-1 block text-sm text-[var(--color-text-secondary)]">{c.detail}</span>
              </div>
            ))}
          </div>
        ) : null}
        {e.kind === "steps" && e.steps ? (
          <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {e.steps.map((st, i) => (
              <li key={i}>{st}</li>
            ))}
          </ol>
        ) : null}
        {e.kind === "story" && e.paragraphs
          ? e.paragraphs.map((p, i) => (
              <p key={i} className={body}>
                {p}
              </p>
            ))
          : null}
        {e.note ? <p className={body}>{e.note}</p> : null}
      </>
    );
  };

  return (
    <div className={`contents${koWrap}`}>
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <BackLink href={`/${locale}/calculators`} label={`← ${tNav("calculators")}`} />
        <header className="mb-6 max-w-3xl">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">{t(`${type}.h1`)}</h1>
          <p className="mt-3 text-[var(--color-text-secondary)]">{t(`${type}.lead`)}</p>
        </header>

        <FireTypeCalculator type={type} />

        {extra?.position === "top" ? <section className="mt-10 max-w-3xl">{renderExtra(extra, false)}</section> : null}

        <div className="mt-12 grid gap-10 border-t border-[var(--color-border)] pt-10 lg:grid-cols-2">
          <section>
            <h2 className={h2}>{t("sectionHow")}</h2>
            {how.map((p, i) => (
              <p key={i} className={body}>{p}</p>
            ))}
            <h3 className="mt-5 text-base font-semibold text-[var(--color-text-primary)]">{t("sectionFormula")}</h3>
            <p className="mt-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text-primary)]">
              {t(`${type}.formula`)}
            </p>
            {extra?.position === "col" ? renderExtra(extra, true) : null}
          </section>
          <section>
            <h2 className={h2}>{t("sectionFit")}</h2>
            <p className={body}>{t(`${type}.bestFor`)}</p>
            <h3 className="mt-5 text-base font-semibold text-[var(--color-text-primary)]">{t("sectionWatch")}</h3>
            <p className={body}>{t(`${type}.watchOut`)}</p>
          </section>
        </div>

        {extra?.position === "mid" ? <section className="mt-10 max-w-3xl">{renderExtra(extra, false)}</section> : null}

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

        {extra?.position === "late" ? <section className="mt-10 max-w-3xl">{renderExtra(extra, false)}</section> : null}

        <section className="mt-10 border-t border-[var(--color-border)] pt-10">
          <h2 className={h2}>{t("sectionRelated")}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {otherTypes.map((x) => (
              <Link
                key={x}
                href={`/calculators/${x}`}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-primary)]"
              >
                <span className="font-semibold text-[var(--color-text-primary)]">{t(`${x}.name`)}</span>
                <span className="mt-1 block text-sm text-[var(--color-text-secondary)]">{t(`${x}.short`)}</span>
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-primary)]"
            >
              <span className="font-semibold text-[var(--color-text-primary)]">{t("mainCalculator")}</span>
              <span className="mt-1 block text-sm text-[var(--color-text-secondary)]">{tCalc("subtitle")}</span>
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
