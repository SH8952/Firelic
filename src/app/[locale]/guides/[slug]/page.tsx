import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getGuideBySlug, getGuides } from "@/content/guides";
import { GuideViewTracker } from "./GuideViewTracker";

export function generateStaticParams() {
  const locales = ["en", "ko", "ja", "es"];
  return locales.flatMap((locale) => getGuides(locale).map((g) => ({ locale, slug: g.slug })));
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const guide = getGuideBySlug(locale, slug);
  if (!guide) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <GuideViewTracker slug={slug} locale={locale} />
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-primary)]">{guide.category}</p>
      <h1 className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">{guide.title}</h1>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{guide.publishedAt}</p>
      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-[var(--color-text-primary)]">
        {guide.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
