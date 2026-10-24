/**
 * Shared SEO helpers: JSON-LD structured data + hreflang alternates for firelic.
 *
 * Emits a schema.org WebApplication entry so search engines can render
 * rich results (app name, category, rating placeholder omitted since we
 * have no reviews yet). Mirrors the pattern used in ExifLens/FlyDroneMap.
 */

import { routing } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

/**
 * Builds the `alternates.languages` (hreflang) map for a given path, e.g.
 * languageAlternates("/about") => { en: ".../en/about", ko: ".../ko/about", ... }.
 *
 * [2026-09-27] Added after discovering that every page under [locale] that
 * defines its own `generateMetadata` (the 7 static/policy pages + the guide
 * detail page) was returning `alternates: { canonical }` without `languages`.
 * Next.js does NOT deep-merge `alternates` between a layout and a page — a
 * page-level `alternates` object replaces the layout's entirely — so all of
 * those pages were silently losing the hreflang tags that layout.tsx sets for
 * the locale homepage. Verified locally: `/en` rendered 4 hreflang tags,
 * `/en/about` and `/en/guides/what-is-fire` rendered 0. This helper lets every
 * page rebuild its own hreflang map alongside its own canonical.
 */
export function languageAlternates(path: string, locales: readonly string[] = routing.locales): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }
  return languages;
}

/**
 * 공유 미리보기(og:image) 목록. 페이지가 자체 openGraph를 정의하면 레이아웃의
 * openGraph(와 파일 기반 opengraph-image)가 통째로 대체되어 이미지가 빠지므로,
 * 정책·FAQ·가이드 목록·홈 등은 이 헬퍼로 이미지를 명시한다. (2026-10-23)
 */
export function ogImages(locale: string) {
  return [
    {
      url: `${SITE_URL}/${locale}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: "FIRE Calculator — Early Retirement Simulator",
    },
  ];
}

export function webApplicationJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FIRE Calculator",
    url: `${SITE_URL}/${locale}`,
    description:
      "Interactively simulate your path to Financial Independence, Retire Early (FIRE). Adjust your savings, returns and withdrawal rate to see your FIRE number and target age.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    inLanguage: locale,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
