import { getTranslations, setRequestLocale } from "next-intl/server";
import { FireCalculator } from "@/components/FireCalculator";
import { routing } from "@/i18n/routing";
import { webApplicationJsonLd } from "@/lib/seo";
import { HomeGuideHighlights } from "@/components/home-guide-highlights";
import { HomeFaqHighlights } from "@/components/home-faq-highlights";
import { AdSlot } from "@/components/AdSlot";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";

// 이 페이지는 요청 시점에 따라 결과가 달라지는 동작(무작위 가이드/FAQ 카드)을
// 가지고 있어 항상 요청마다 렌더링한다. 레이아웃에서 headers()를 걷어낸 뒤에도
// 기존 동작이 그대로 유지되도록 명시한다.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "calculator" });
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
      <FireCalculator />

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
