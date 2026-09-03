import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { compileGuide, getGuideMeta, getGuideSlugs } from "@/lib/guides";
import { GuideViewTracker } from "./GuideViewTracker";
import { GuideImageDevPanel } from "@/components/dev/guide-image-dev-panel";

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

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <GuideViewTracker slug={slug} locale={locale} />
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-primary)]">{meta.category}</p>
      <h1 className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">{meta.title}</h1>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{meta.publishedAt}</p>

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

      <div className="prose prose-neutral dark:prose-invert mt-6 max-w-none text-sm leading-relaxed text-[var(--color-text-primary)]">
        <Content />
      </div>

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
