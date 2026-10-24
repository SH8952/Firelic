import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import * as runtime from "react/jsx-runtime";
import type { ComponentType } from "react";

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

/**
 * Categories are shown on the /guides index page in this fixed order,
 * matching the category strings used when the guide topics queue
 * (automation/guide-topics-queue.json) assigns a category to each topic.
 * "Practical Wealth-Building Strategies" was added 2026-09-20 for concrete,
 * income-tier/product-comparison guides (illustrative examples only, not
 * personalized financial advice) as opposed to the more conceptual/
 * explainer-style topics in the original four buckets.
 * Any category string that doesn't match one of these falls back to
 * appearing after them, ordered by its most recently published guide.
 */
const CATEGORY_ORDER = [
  "FIRE Basics & Concepts",
  "Practical Wealth-Building Strategies",
  "Saving & Investing Strategy",
  "Country & Tax Considerations",
  "Retirement Life & Withdrawal Strategy",
];

// Korean guides follow the "money basics -> early retirement" journey order.
const CATEGORY_ORDER_BY_LOCALE: Record<string, string[]> = {
  ko: ["돈 관리 기초", "보험·세금·연금", "재테크·투자", "소득 키우기", "조기 은퇴 실현", "은퇴 이후", "해외 제도 참고"],
};

/** 연말정산 전용 섹션(/year-end-tax)에 속하는 가이드의 category 값. 일반 가이드 목록(/guides)에서는 제외한다. */
export const YEAR_END_CATEGORY = "연말정산";
/** 연말정산 섹션 맨 앞에 함께 보여줄 기존 입문 가이드(카테고리는 그대로 유지). */
export const YEAR_END_INTRO_SLUG = "year-end-tax-settlement-basics";

export type GuideFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags?: string[];
  /** Public path to the guide's representative image (e.g. "/guides/images/{slug}.webp"). */
  image?: string;
  /** Unsplash photographer name, shown as "Photo by X on Unsplash" under the image. */
  imageCredit?: string;
  /** Unsplash photographer profile URL (with UTM tracking params). */
  imageCreditUrl?: string;
};

export type GuideMeta = GuideFrontmatter & {
  slug: string;
  /** Rough reading time in minutes, derived from word count (~200 wpm). */
  readingMinutes: number;
};

function guideDir(locale: string) {
  return path.join(GUIDES_DIR, locale);
}

/** All published guide slugs for a locale, derived from the .mdx filenames present. */
export function getGuideSlugs(locale: string): string[] {
  const dir = guideDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function readRawSource(locale: string, slug: string): string {
  const filePath = path.join(guideDir(locale), `${slug}.mdx`);
  return fs.readFileSync(filePath, "utf8");
}

function estimateReadingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Frontmatter + slug + reading time for one guide, without compiling the MDX body. */
export function getGuideMeta(locale: string, slug: string): GuideMeta | null {
  const filePath = path.join(guideDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as GuideFrontmatter;
  return {
    ...fm,
    slug,
    readingMinutes: estimateReadingMinutes(content),
  };
}

/** All guides for a locale, sorted newest-first by publishedAt. */
export function getAllGuidesMeta(locale: string): GuideMeta[] {
  return getGuideSlugs(locale)
    .map((slug) => getGuideMeta(locale, slug))
    .filter((g): g is GuideMeta => g !== null)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

/** Convenience alias kept for call sites that just want the flat list. */
export function getGuides(locale: string): GuideMeta[] {
  return getAllGuidesMeta(locale);
}

export function getGuideBySlug(locale: string, slug: string): GuideMeta | null {
  return getGuideMeta(locale, slug);
}

/**
 * Groups guides by category for the /guides index page. Categories in
 * CATEGORY_ORDER are shown first in that order; any other category text
 * is grouped afterwards, ordered by how recently its newest guide was
 * published. Guides within a category are sorted oldest-first (a natural
 * reading order for a topic bucket like "FIRE Basics & Concepts").
 */
export function getGuidesByCategory(
  locale: string,
): Array<{ category: string; guides: GuideMeta[] }> {
  const guides = getAllGuidesMeta(locale).filter((g) => g.category?.trim() !== YEAR_END_CATEGORY);
  const groups = new Map<string, GuideMeta[]>();

  for (const guide of guides) {
    const category = guide.category?.trim() || "Other";
    const existing = groups.get(category);
    if (existing) {
      existing.push(guide);
    } else {
      groups.set(category, [guide]);
    }
  }

  const order = CATEGORY_ORDER_BY_LOCALE[locale] ?? CATEGORY_ORDER;
  const sortedEntries = Array.from(groups.entries()).sort(([aLabel, aGuides], [bLabel, bGuides]) => {
    const aIndex = order.indexOf(aLabel);
    const bIndex = order.indexOf(bLabel);
    if (aIndex !== -1 || bIndex !== -1) {
      return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
    }
    return aGuides[0].publishedAt < bGuides[0].publishedAt ? 1 : -1;
  });

  return sortedEntries.map(([category, categoryGuides]) => ({
    category,
    guides: [...categoryGuides].sort((a, b) => (a.publishedAt > b.publishedAt ? 1 : -1)),
  }));
}

/** 연말정산 섹션에 보여줄 가이드: 입문 글을 맨 앞에, 나머지는 발행일 오름차순. */
export function getYearEndGuides(locale: string): GuideMeta[] {
  const all = getAllGuidesMeta(locale);
  const intro = all.filter((g) => g.slug === YEAR_END_INTRO_SLUG);
  const rest = all
    .filter((g) => g.category?.trim() === YEAR_END_CATEGORY)
    .sort((a, b) => (a.publishedAt > b.publishedAt ? 1 : -1));
  return [...intro, ...rest];
}

/**
 * Compiles one guide's MDX body into a renderable React component. Called
 * from a server component (RSC) — @mdx-js/mdx's `evaluate` runs the MDX
 * compiler and hands back a ready-to-render `default` export, following the
 * standard mdx-js Next.js App Router integration pattern.
 */
export async function compileGuide(
  locale: string,
  slug: string,
): Promise<{ Content: ComponentType<{ components?: Record<string, ComponentType> }>; meta: GuideMeta } | null> {
  const filePath = path.join(guideDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = readRawSource(locale, slug);
  const { data, content } = matter(raw);
  const fm = data as GuideFrontmatter;

  const { default: Content } = await evaluate(content, {
    ...runtime,
    // singleTilde: false — 본문에서 "~"를 범위 표기(예: "f/11~f/16", "ISO 100~200")로
    // 자주 쓰는데, remark-gfm 기본값(singleTilde: true)은 "~" 하나만 있어도 취소선으로
    // 해석해 같은 문단의 두 "~" 사이가 통째로 취소선이 되고 "~" 문자도 사라지는
    // 버그가 있었음(2026-10-02 확인). "~~"(더블 틸드)로만 취소선을 인식하도록 제한.
    // flydronemap은 2026-09-28에 동일하게 수정함. 이 옵션을 제거하지 말 것.
    remarkPlugins: [[remarkGfm, { singleTilde: false }]],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  });

  return {
    Content: Content as ComponentType<{ components?: Record<string, ComponentType> }>,
    meta: {
      ...fm,
      slug,
      readingMinutes: estimateReadingMinutes(content),
    },
  };
}
