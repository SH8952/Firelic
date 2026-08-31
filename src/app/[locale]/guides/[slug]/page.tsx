import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { compileGuide, getGuideSlugs } from "@/lib/guides";
import { GuideViewTracker } from "./GuideViewTracker";

export function generateStaticParams() {
  const locales = ["en", "ko", "ja", "es"];
  return locales.flatMap((locale) => getGuideSlugs(locale).map((slug) => ({ locale, slug })));
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
      <div className="prose prose-neutral dark:prose-invert mt-6 max-w-none text-sm leading-relaxed text-[var(--color-text-primary)]">
        <Content />
      </div>
    </article>
  );
}
