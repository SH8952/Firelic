import { guidesEn } from "./en";
import type { GuideArticle } from "./types";

// Guides are English-only for the initial launch (PRD section 9: "영문 우선").
// Non-English locales will show an empty list with a note; content will be
// localized in a later pass once initial SEO traction is established.
export function getGuides(locale: string): GuideArticle[] {
  return locale === "en" ? guidesEn : [];
}

export function getGuideBySlug(locale: string, slug: string): GuideArticle | undefined {
  return getGuides(locale).find((g) => g.slug === slug);
}

export type { GuideArticle } from "./types";
