import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function GuideToolCta({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "guides" });
  return (
    <div className="mt-8 flex flex-col items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[var(--color-text-primary)]">{t("ctaBannerText")}</p>
      <Link
        href="/"
        className="shrink-0 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        {t("ctaBannerButton")}
      </Link>
    </div>
  );
}
