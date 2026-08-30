import { guidesEn } from "./en";
import { guidesKo } from "./ko";
import { guidesJa } from "./ja";
import { guidesEs } from "./es";
import type { GuideArticle } from "./types";

const GUIDES: Record<string, GuideArticle[]> = {
  en: guidesEn,
  ko: guidesKo,
  ja: guidesJa,
  es: guidesEs,
};

export function getGuides(locale: string): GuideArticle[] {
  return GUIDES[locale] ?? GUIDES.en;
}

export function getGuideBySlug(locale: string, slug: string): GuideArticle | undefined {
  return getGuides(locale).find((g) => g.slug === slug);
}

/** Groups guides by category, preserving first-seen category order. */
export function getGuidesByCategory(locale: string): Array<{ category: string; guides: GuideArticle[] }> {
  const guides = getGuides(locale);
  const order: string[] = [];
  const grouped = new Map<string, GuideArticle[]>();
  for (const g of guides) {
    if (!grouped.has(g.category)) {
      grouped.set(g.category, []);
      order.push(g.category);
    }
    grouped.get(g.category)!.push(g);
  }
  return order.map((category) => ({ category, guides: grouped.get(category)! }));
}

export type { GuideArticle } from "./types";
