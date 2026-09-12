import { setRequestLocale } from "next-intl/server";
import { FireCalculator } from "@/components/FireCalculator";
import { routing } from "@/i18n/routing";
import { webApplicationJsonLd } from "@/lib/seo";
import { HomeGuideHighlights } from "@/components/home-guide-highlights";

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
    </>
  );
}
