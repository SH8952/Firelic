import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AdSenseScript } from "@/components/AdSenseScript";
import { webApplicationJsonLd } from "@/lib/seo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SiteFooter } from "@/components/SiteFooter";
import "../globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}`;
  }

  return {
    title: "FIRE Calculator — Early Retirement Simulator",
    description:
      "Interactively simulate your path to Financial Independence, Retire Early (FIRE). Adjust your savings, returns and withdrawal rate to see your FIRE number and target age.",
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages,
    },
    openGraph: {
      title: "FIRE Calculator",
      description: "Simulate your path to Financial Independence, Retire Early.",
      url: `${SITE_URL}/${locale}`,
      locale,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationJsonLd(locale)),
          }}
        />
        <GoogleAnalytics />
        <AdSenseScript />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="flex justify-end px-4 pt-3">
              <LocaleSwitcher />
            </div>
            {children}
            <SiteFooter />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
