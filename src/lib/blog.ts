import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import * as runtime from "react/jsx-runtime";
import type { ComponentType } from "react";

/**
 * 블로그(한국어 전용, /ko/blog) — 가상 인물의 상황을 따라가며 정보를 전하는 글.
 * 글 파일: content/blog/ko/<slug>.mdx
 *
 * 예약 공개: 파일을 미리 넣어 두고 frontmatter의 publishedAt(YYYY-MM-DD, 한국 날짜) 이후에만
 * 목록·상세·사이트맵에 나타난다. 페이지는 revalidate(1시간)로 날짜가 지나면 자동 갱신된다.
 * 개발 서버(npm run dev)에서는 미리보기를 위해 미공개 글도 모두 보인다.
 */
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  /** 글 끝에 이어 읽기로 연결할 가이드 slug 목록. */
  relatedGuides?: string[];
};

export type BlogMeta = BlogFrontmatter & { slug: string; readingMinutes: number };

/** 한국 날짜(YYYY-MM-DD). 서버 시간대와 관계없이 KST 기준. */
export function todayKst(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function isBlogPublished(publishedAt: string): boolean {
  // 개발 서버에서는 미리보기를 위해 전부 보인다. BLOG_HIDE_FUTURE=1이면 운영과 같은 예약 공개 동작을 확인할 수 있다.
  if (process.env.NODE_ENV === "development" && process.env.BLOG_HIDE_FUTURE !== "1") return true;
  return publishedAt <= todayKst();
}

function blogDir(locale: string) {
  return path.join(BLOG_DIR, locale);
}

/** 예약 글을 포함한 모든 slug(정적 경로 생성용). */
export function getAllBlogSlugs(locale: string): string[] {
  const dir = blogDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function readingMinutes(body: string): number {
  const chars = body.replace(/\s+/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

export function getBlogMeta(locale: string, slug: string): BlogMeta | null {
  const filePath = path.join(blogDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  return { ...(data as BlogFrontmatter), slug, readingMinutes: readingMinutes(content) };
}

/** 공개된 글만, 최신순. */
export function getPublishedBlogPosts(locale: string): BlogMeta[] {
  return getAllBlogSlugs(locale)
    .map((slug) => getBlogMeta(locale, slug))
    .filter((p): p is BlogMeta => p !== null && isBlogPublished(p.publishedAt))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : a.slug.localeCompare(b.slug)));
}

export async function compileBlogPost(
  locale: string,
  slug: string,
): Promise<{ Content: ComponentType<{ components?: Record<string, ComponentType> }>; meta: BlogMeta } | null> {
  const filePath = path.join(blogDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  const { default: Content } = await evaluate(content, {
    ...runtime,
    // singleTilde:false — "~" 범위 표기가 취소선으로 바뀌는 문제 방지(guides.ts와 동일).
    remarkPlugins: [[remarkGfm, { singleTilde: false }]],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  });
  return {
    Content: Content as ComponentType<{ components?: Record<string, ComponentType> }>,
    meta: { ...(data as BlogFrontmatter), slug, readingMinutes: readingMinutes(content) },
  };
}
