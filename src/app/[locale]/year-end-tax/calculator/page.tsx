import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { YearEndTaxCalculator } from "@/components/YearEndTaxCalculator";
import { breadcrumbJsonLd, languageAlternates, ogImages } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

// 한국어 전용 페이지
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "ko" }];
}

const TITLE = "연말정산 환급 계산기 — 12월에 연금·카드로 환급이 얼마나 늘까";
const DESC =
  "총급여와 카드·연금·월세·의료비를 넣으면 예상 환급액과 계산 과정을 보여 주고, 12월 연금계좌 추가 납입과 카드 결제 수단에 따른 환급 변화를 바로 비교합니다.";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ko") return {};
  const url = `${SITE_URL}/${locale}/year-end-tax/calculator`;
  return {
    title: TITLE,
    description: DESC,
    alternates: { canonical: url, languages: languageAlternates("/year-end-tax/calculator", ["ko"]) },
    openGraph: { title: TITLE, description: DESC, url, type: "website", images: ogImages(locale) },
  };
}

export default async function YearEndCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "ko") notFound();
  setRequestLocale(locale);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: "연말정산", url: `${SITE_URL}/${locale}/year-end-tax` },
    { name: "연말정산 환급 계산기", url: `${SITE_URL}/${locale}/year-end-tax/calculator` },
  ]);
  const guides: Array<[string, string]> = [
    ["credit-vs-debit-card-year-end-tax-split", "카드 공제: 신용카드·체크카드 비율"],
    ["pension-savings-irp-december-deposit-refund", "연금저축·IRP 12월 납입 환급표"],
    ["monthly-rent-tax-credit-requirements-refund", "월세 세액공제 조건과 환급액"],
    ["medical-education-donation-year-end-tax-checklist", "의료비·교육비 공제 체크리스트"],
    ["dual-income-dependents-year-end-tax-allocation", "맞벌이·부양가족 공제 배분"],
    ["why-year-end-tax-refund-is-small-checklist", "환급이 적게 나온 이유 진단"],
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 [word-break:keep-all] [overflow-wrap:break-word]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <BackLink href={`/${locale}/year-end-tax`} label="연말정산" />
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">연말정산 환급 계산기</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
        올해 쓴 금액을 넣으면 예상 환급액과 계산 과정을 보여 드립니다. 오른쪽 12월 시뮬레이션에서 연금계좌를 더 넣거나 카드를 신용·체크 중 무엇으로 쓸지에 따라 환급이 얼마나 달라지는지 바로 비교해 보세요. 입력한 값은 이 브라우저 안에서만 계산되고 서버로 전송되지 않습니다.
      </p>
      <div className="mt-8">
        <YearEndTaxCalculator />
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-[var(--color-primary)]">총급여별 예시로 바로 계산해 보기</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {[3000, 4000, 5000, 6000].map((n) => (
            <li key={n}>
              <a
                href={`/${locale}/year-end-tax/calculator?preset=${n}`}
                className="inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
              >
                총급여 {n.toLocaleString("ko-KR")}만 원 예시
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">예시는 카드 사용액과 연금 납입액을 가정한 값이며, 내 값으로 바꾸면 결과가 바로 달라집니다.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-[var(--color-primary)]">계산 결과가 궁금할 때</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {guides.map(([slug, label]) => (
            <li key={slug}>
              <a href={`/${locale}/guides/${slug}`} className="text-sm text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
                {label} →
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
