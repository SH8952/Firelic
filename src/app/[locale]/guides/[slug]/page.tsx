import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { compileGuide, getGuideMeta, getGuideSlugs } from "@/lib/guides";
import { GuideViewTracker } from "./GuideViewTracker";
import { GuideImageDevPanel } from "@/components/dev/guide-image-dev-panel";
import { GuideToolCta } from "@/components/GuideToolCta";
import { ShareButton } from "@/components/share-button";
import { breadcrumbJsonLd, languageAlternates } from "@/lib/seo";
import { ReadingProgress } from "@/components/guides/reading-progress";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export function generateStaticParams() {
  const locales = ["en", "ko", "ja", "es"];
  return locales.flatMap((locale) => getGuideSlugs(locale).map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const meta = getGuideMeta(locale, slug);
  if (!meta) return {};

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/guides/${slug}`,
      languages: languageAlternates(`/guides/${slug}`),
    },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}/guides/${slug}`,
      images: meta.image ? [{ url: `${SITE_URL}${meta.image}`, width: 1600, height: 900 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: meta.image ? [`${SITE_URL}${meta.image}`] : undefined,
    },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const compiled = await compileGuide(locale, slug);
  if (!compiled) {
    notFound();
  }
  const { Content, meta } = compiled;
  const t = await getTranslations({ locale, namespace: "guides" });
  // 한국어: 제목·본문 단어 중간 줄바꿈 방지(ExifLens와 동일 범위 — ja 제외).
  const koWrap =
    locale === "ko" ? " [word-break:keep-all] [overflow-wrap:break-word]" : "";
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: t("title"), url: `${SITE_URL}/${locale}/guides` },
    { name: meta.title, url: `${SITE_URL}/${locale}/guides/${slug}` },
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
    mainEntityOfPage: `${SITE_URL}/${locale}/guides/${slug}`,
    inLanguage: locale,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <ReadingProgress targetId="guide-article" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <GuideViewTracker slug={slug} locale={locale} />
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-primary)]">{meta.category}</p>
      <h1 className={`mt-2 text-2xl font-bold text-[var(--color-text-primary)]${koWrap}`}>{meta.title}</h1>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[var(--color-text-secondary)]">
          {meta.publishedAt}
          {meta.updatedAt && meta.updatedAt !== meta.publishedAt ? (
            <span className="ml-2 text-[var(--color-text-secondary)]/80">
              · {t("updatedLabel")} {meta.updatedAt}
            </span>
          ) : null}
        </p>
        <ShareButton
          title={meta.title}
          text={meta.description}
          url={`${SITE_URL}/${locale}/guides/${slug}`}
          image={meta.image ? `${SITE_URL}${meta.image}` : undefined}
        />
      </div>

      <GuideToolCta locale={locale} />

      {meta.image ? (
        <figure className="mt-6 flex flex-col gap-1.5">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
            <Image
              src={meta.image}
              alt={meta.title}
              fill
              sizes="(min-width: 768px) 672px, 100vw"
              className="object-cover"
              priority
            />
          </div>
          {meta.imageCredit && meta.imageCreditUrl ? (
            <figcaption className="text-xs text-[var(--color-text-secondary)]">
              Photo by{" "}
              <a
                href={meta.imageCreditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--color-text-primary)]"
              >
                {meta.imageCredit}
              </a>{" "}
              on{" "}
              <a
                href="https://unsplash.com/?utm_source=FIRECalculator&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--color-text-primary)]"
              >
                Unsplash
              </a>
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div
        id="guide-article"
        className={`prose prose-neutral dark:prose-invert mt-6 max-w-none text-sm leading-relaxed text-[var(--color-text-primary)] prose-headings:tracking-tight prose-headings:scroll-mt-6 prose-a:text-[var(--color-primary)] prose-p:leading-8 prose-li:leading-7 prose-h2:mt-12 prose-h2:border-b prose-h2:border-[var(--color-border)] prose-h2:pb-2 prose-h3:mt-8 prose-blockquote:border-[var(--color-primary)]/60 prose-blockquote:not-italic prose-img:rounded-lg${koWrap}`}
      >
        <Content />
      </div>

      <GuideToolCta locale={locale} />

      {process.env.NODE_ENV === "development" ? (
        <GuideImageDevPanel
          slug={slug}
          currentImage={meta.image}
          currentImageCredit={meta.imageCredit}
          tags={meta.tags}
        />
      ) : null}
    </article>
  );
}
