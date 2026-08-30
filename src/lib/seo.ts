/**
 * Shared SEO helpers: JSON-LD structured data for firelic.
 *
 * Emits a schema.org WebApplication entry so search engines can render
 * rich results (app name, category, rating placeholder omitted since we
 * have no reviews yet). Mirrors the pattern used in ExifLens/FlyDroneMap.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export function webApplicationJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FIRE Calculator",
    url: `${SITE_URL}/${locale}`,
    description:
      "Interactively simulate your path to Financial Independence, Retire Early (FIRE). Adjust your savings, returns and withdrawal rate to see your FIRE number and target age.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    inLanguage: locale,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
