import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getGuideBySlug, getGuides } from "@/content/guides";
import { GuideViewTracker } from "./GuideViewTracker";

export function generateStaticParams() {
  return getGuides("en").map((g) => ({ locale: "en", slug: g.slug }));
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
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{guide.title}</h1>
      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-[var(--color-text-primary)]">
        {guide.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
