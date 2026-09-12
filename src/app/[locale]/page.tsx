import { getTranslations, setRequestLocale } from "next-intl/server";
import { FireCalculator } from "@/components/FireCalculator";
import { routing } from "@/i18n/routing";
import { webApplicationJsonLd } from "@/lib/seo";
import { HomeGuideHighlights } from "@/components/home-guide-highlights";
import { AdSlot } from "@/components/AdSlot";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";

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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationJsonLd(locale)),
        }}
      />
      <FireCalculator />

      {/* 가이드 아티클 하이라이트 — 홈페이지 텍스트/링크 풍부화 (AdSense 재심사 대응, 계산기 구조는 변경 없음) */}
      <HomeGuideHighlights locale={locale} />

      {/* 투자 자문 경고 문구 + 하단 광고 — 사용자 요청으로 페이지 맨 아래로 이동 (다른 2개 사이트와 배치 통일) */}
      <DisclaimerFooter text={t("disclaimer")} />

      <div className="mx-auto max-w-6xl px-4 pb-10">
        <AdSlot variant="display" label={t("adDisplay")} />
      </div>
    </>
  );
}
