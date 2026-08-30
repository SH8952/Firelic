import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getGuides } from "@/content/guides";

export default async function GuidesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guides");
  const guides = getGuides(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t("title")}</h1>
      {guides.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-text-secondary)]">{t("empty")}</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-6">
          {guides.map((g) => (
            <li key={g.slug} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <Link href={`/guides/${g.slug}`} className="text-lg font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
                {g.title}
              </Link>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{g.description}</p>
              <Link href={`/guides/${g.slug}`} className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)]">
                {t("readMore")} →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
