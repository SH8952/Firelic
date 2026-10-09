import { getTranslations } from "next-intl/server";
import type { PolicyPage } from "@/content/policies";
import { BackLink } from "@/components/back-link";

export async function PolicyPageView({ page, locale }: { page: PolicyPage; locale: string }) {
  const t = await getTranslations({ locale, namespace: "BackNav" });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <BackLink href={`/${locale}`} label={t("home")} />
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{page.title}</h1>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">Last updated: {page.updated}</p>
      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-[var(--color-text-primary)]">
        {page.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
