import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FireCalculator } from "@/components/FireCalculator";
import { routing } from "@/i18n/routing";
import { languageAlternates, ogImages, webApplicationJsonLd } from "@/lib/seo";
import { HomeGuideHighlights } from "@/components/home-guide-highlights";
import { HomeFaqHighlights } from "@/components/home-faq-highlights";
import { HomeFireTypes } from "@/components/home-fire-types";
import { HomeYearEndBanner } from "@/components/home-year-end-banner";
import { AdSlot } from "@/components/AdSlot";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";

// 2026-11-15 홈 정적화(ISR): 홈이 요청마다 서버에서 만들어지면서 한동안 접속이 없을 때 첫 접속이 1~2초 느렸다(함수 콜드 스타트).
// 이제 5분(300초)마다 새로 만들어 CDN 캐시에서 바로 응답한다. 무작위 가이드/FAQ 카드는 새로 만들 때마다 다시 뽑히므로
// "요청마다"가 아니라 "5분마다" 바뀐다(노출되는 FAQ 항목과 FAQPage 구조화 데이터는 항상 같은 묶음으로 함께 갱신).
export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

// 홈 제목·설명을 언어별로 제공(2026-10-23 전까지는 레이아웃의 영어 고정 문구가 ko/ja/es에도 그대로 노출됨).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  const url = `${SITE_URL}/${locale}`;
  const title = t("homeTitle");
  const description = t("homeDescription");

  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates("") },
    openGraph: { title, description, url, locale, type: "website", images: ogImages(locale) },
    twitter: { card: "summary_large_image", title, description, images: [ogImages(locale)[0].url] },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "calculator" });
  const tSeo = await getTranslations({ locale, namespace: "Seo" });
  // 한국어: 단어 중간에서 줄바꿈되지 않도록 어절 단위로 줄바꿈(모바일에서 보던 문제).
  // display:contents라 레이아웃에는 영향 없음 — word-break/overflow-wrap은 상속 속성이라
  // 하위의 FireCalculator·가이드/FAQ 하이라이트 전체에 자동으로 적용됨.
  // ExifLens가 먼저 적용한 패턴(claude/exiflens-home-blog-cta-polish-2026-10-08.md)과 동일.
  const koWrap =
    locale === "ko" ? " [word-break:keep-all] [overflow-wrap:break-word]" : "";

  return (
    <div className={`contents${koWrap}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationJsonLd(locale)),
        }}
      />
      {/* 페이지 대표 제목(H1) — 화면에는 헤더가 제목 역할을 하므로 스크린리더/검색엔진용으로만 제공 */}
      <h1 className="sr-only">{tSeo("homeH1")}</h1>
      <FireCalculator />

      {/* 연말정산 배너(한국어 전용, 2026-10-24 신설) */}
      <HomeYearEndBanner locale={locale} />

      {/* FIRE 유형별 계산기 링크 카드(2026-10-24 신설) */}
      <HomeFireTypes locale={locale} />

      {/* 가이드 아티클 하이라이트 — 홈페이지 텍스트/링크 풍부화 (AdSense 재심사 대응, 계산기 구조는 변경 없음) */}
      <HomeGuideHighlights locale={locale} />

      {/* FAQ 하이라이트 — /faq 전체 목록 중 5개 무작위 노출 (2026-09-27 신규 추가) */}
      <HomeFaqHighlights locale={locale} />

      {/* 투자 자문 경고 문구 + 하단 광고 — 사용자 요청으로 페이지 맨 아래로 이동 (다른 2개 사이트와 배치 통일) */}
      <DisclaimerFooter text={t("disclaimer")} />

      <div className="mx-auto max-w-6xl px-4 pb-10">
        <AdSlot variant="display" label={t("adDisplay")} />
      </div>
    </div>
  );
}
