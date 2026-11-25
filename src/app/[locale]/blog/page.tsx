import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { getPublishedBlogPosts } from "@/lib/blog";
import { breadcrumbJsonLd, languageAlternates, ogImages } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

// 예약 공개된 글이 날짜에 맞춰 나타나도록 1시간마다 다시 만든다.
export const revalidate = 3600;
// 블로그는 한국어 전용이다. 다른 언어 주소는 만들지 않는다(404).
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "ko" }];
}

const TITLE = "블로그 — 가상 사례로 풀어 보는 돈 이야기";
const DESCRIPTION =
  "빚 갚기, 월 저축, 보험 정리, 은퇴 자금처럼 검색으로 많이 묻는 고민을 가상 인물의 상황으로 풀어 보는 글 모음입니다. 모든 인물은 가상이며 숫자는 계산기 결과와 확인한 제도 수치만 사용합니다.";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ko") return {};
  const url = `${SITE_URL}/${locale}/blog`;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url, languages: languageAlternates("/blog", ["ko"]) },
    openGraph: { title: TITLE, description: DESCRIPTION, url, type: "website", images: ogImages(locale) },
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "ko") notFound();
  setRequestLocale(locale);
  const tBack = await getTranslations("BackNav");
  const posts = getPublishedBlogPosts(locale);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: "블로그", url: `${SITE_URL}/${locale}/blog` },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 [word-break:keep-all] [overflow-wrap:break-word]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <BackLink href={`/${locale}`} label={tBack("home")} />
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">블로그</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
        검색으로 자주 묻는 돈 고민을 가상 인물의 상황으로 풀어 봅니다. 인물과 사연은 모두 지어낸 것이고, 숫자는 이 사이트의
        계산기 결과와 확인한 제도 수치만 씁니다. 개념 정리는 <a href={`/${locale}/guides`} className="text-[var(--color-primary)] underline">가이드</a>에서 볼 수 있습니다.
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--color-text-secondary)]">첫 글을 준비하고 있습니다.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {posts.map((p) => (
            <li key={p.slug} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-xs text-[var(--color-text-secondary)]">
                {p.publishedAt} · 약 {p.readingMinutes}분
              </p>
              <a
                href={`/${locale}/blog/${p.slug}`}
                className="mt-1 block text-base font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
              >
                {p.title}
              </a>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{p.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
