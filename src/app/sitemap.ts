import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getGuides, getGuideSlugs } from "@/lib/guides";
import { FIRE_TYPES } from "@/lib/fireTypes";
import { REFERENCE_TABLES } from "@/lib/referenceTables";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

const STATIC_PATHS = ["", "/about", "/privacy-policy", "/terms", "/affiliate-disclosure", "/contact", "/guides", "/faq", "/calculators", ...FIRE_TYPES.map((t) => `/calculators/${t}`), ...REFERENCE_TABLES.map((t) => `/reference/${t}`)];

// 언어별 대체 주소(hreflang)를 사이트맵에도 함께 제공한다(페이지 <head>의 hreflang과 동일한 내용).
function languageMap(path: string, locales: readonly string[]): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}${path}`;
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // lastmod는 빌드 시각이 아니라 실제 콘텐츠 날짜를 쓴다(2026-10-23).
  // 글이 늘어나면 바뀌는 홈·가이드 목록은 가장 최근 가이드 날짜, 그 외 고정 페이지는 생략.
  const newest = routing.locales
    .flatMap((l) => getGuides(l))
    .map((g) => g.updatedAt ?? g.publishedAt)
    .sort()
    .pop();

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      const dynamicPage = path === "" || path === "/guides";
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        ...(dynamicPage && newest ? { lastModified: new Date(newest) } : {}),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.6,
        alternates: { languages: languageMap(path, routing.locales) },
      });
    }
    for (const guide of getGuides(locale)) {
      const available = routing.locales.filter((l) => getGuideSlugs(l).includes(guide.slug));
      entries.push({
        url: `${SITE_URL}/${locale}/guides/${guide.slug}`,
        lastModified: new Date(guide.updatedAt ?? guide.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: languageMap(`/guides/${guide.slug}`, available) },
      });
    }
  }

  return entries;
}
