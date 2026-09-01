"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { routing } from "@/i18n/routing";
import { trackEvent } from "@/lib/analytics";

// Two-letter abbreviations, matching ExifLens's language switcher
// (src/i18n/routing.ts localeLabels) instead of native-script names.
const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  ko: "KO",
  ja: "JA",
  es: "ES",
};

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLocale = (params.locale as string) ?? routing.defaultLocale;

  return (
    <select
      aria-label="Language"
      value={currentLocale}
      onChange={(e) => {
        const nextLocale = e.target.value;
        trackEvent("locale_switch", { from_locale: currentLocale, to_locale: nextLocale });
        router.replace(pathname, { locale: nextLocale });
      }}
      className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm text-[var(--color-text-primary)]"
    >
      {routing.locales.map((locale) => (
        <option key={locale} value={locale}>
          {LOCALE_LABELS[locale] ?? locale}
        </option>
      ))}
    </select>
  );
}
