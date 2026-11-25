import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { compileBlogPost, getAllBlogSlugs, getBlogMeta, isBlogPublished } from "@/lib/blog";
import { getGuideMeta } from "@/lib/guides";
import { ShareButton } from "@/components/share-button";
import { guideTools } from "@/components/guides/tools";
import { breadcrumbJsonLd, languageAlternates, ogImages } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

// 예약 공개: 날짜가 지나면 1시간 안에 나타난다. 아직 공개 전이면 404.
export const revalidate = 3600;
export const dynamicParams = false;
export function generateStaticParams() {
  return getAllBlogSlugs("ko").map((slug) => ({ locale: "ko", slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const meta = locale === "ko" ? getBlogMeta(locale, slug) : null;
  if (!meta || !isBlogPublished(meta.publishedAt)) return {};
  const url = `${SITE_URL}/${locale}/blog/${slug}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url, languages: languageAlternates(`/blog/${slug}`, ["ko"]) },
    openGraph: { type: "article", title: meta.title, description: meta.description, url, images: ogImages(locale) },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (locale !== "ko") notFound();
  setRequestLocale(locale);
  const compiled = await compileBlogPost(locale, slug);
  if (!compiled || !isBlogPublished(compiled.meta.publishedAt)) notFound();
  const { Content, meta } = compiled;
  const related = (meta.relatedGuides ?? [])
    .map((s) => getGuideMeta(locale, s))
    .filter((g): g is NonNullable<typeof g> => g !== null);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: "블로그", url: `${SITE_URL}/${locale}/blog` },
    { name: meta.title, url: `${SITE_URL}/${locale}/blog/${slug}` },
  ]);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt ?? meta.publishedAt,
    author: { "@type": "Organization", name: "FIRE Calculator" },
    publisher: { "@type": "Organization", name: "FIRE Calculator" },
    mainEntityOfPage: `${SITE_URL}/${locale}/blog/${slug}`,
    inLanguage: locale,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 [word-break:keep-all] [overflow-wrap:break-word]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
        <a href={`/${locale}`} className="hover:text-[var(--color-primary)]">홈</a>
        <span aria-hidden>›</span>
        <a href={`/${locale}/blog`} className="hover:text-[var(--color-primary)]">블로그</a>
        <span aria-hidden>›</span>
        <span aria-current="page" className="line-clamp-1 max-w-[16rem] sm:max-w-md">{meta.title}</span>
      </nav>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{meta.title}</h1>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[var(--color-text-secondary)]">
          {meta.publishedAt}
          {meta.updatedAt && meta.updatedAt !== meta.publishedAt ? <span className="ml-2">· 수정 {meta.updatedAt}</span> : null}
          <span className="ml-2 rounded-full border border-[var(--color-border)] px-2 py-0.5">가상 사례</span>
        </p>
        <ShareButton title={meta.title} text={meta.description} url={`${SITE_URL}/${locale}/blog/${slug}`} />
      </div>

      <div className="prose prose-neutral dark:prose-invert mt-6 max-w-none text-sm leading-relaxed text-[var(--color-text-primary)] prose-headings:tracking-tight prose-headings:scroll-mt-6 prose-a:text-[var(--color-primary)] prose-p:leading-8 prose-li:leading-7 prose-h2:mt-10 prose-h3:mt-8 prose-blockquote:border-[var(--color-primary)]/60 prose-blockquote:not-italic">
        <Content components={guideTools} />
      </div>

      {related.length > 0 ? (
        <section className="mt-12" aria-labelledby="blog-related-title">
          <h2 id="blog-related-title" className="text-base font-bold text-[var(--color-text-primary)]">더 정확히 알아보려면</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {related.map((g) => (
              <li key={g.slug}>
                <a href={`/${locale}/guides/${g.slug}`} className="text-sm text-[var(--color-primary)] hover:underline">{g.title}</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
