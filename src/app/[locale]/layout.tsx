import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ConsentBanner } from "@/components/ConsentBanner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AdSenseScript } from "@/components/AdSenseScript";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "../globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
// Naver Search Advisor (웹마스터 도구) site-ownership verification meta tag.
// Optional — only rendered once the code is issued and set as an env var.
const NAVER_SITE_VERIFICATION = process.env.NAVER_SITE_VERIFICATION;

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
    title: "FIRE Calculator — Retire Early Planner",
    description:
      "Simulate your path to Financial Independence, Retire Early (FIRE) instantly.",
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages,
      types: {
        "application/rss+xml": `${SITE_URL}/rss.xml`,
      },
    },
    openGraph: {
      title: "FIRE Calculator",
      description: "Simulate your path to Financial Independence, Retire Early.",
      url: `${SITE_URL}/${locale}`,
      locale,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    ...(NAVER_SITE_VERIFICATION && {
      verification: {
        other: {
          "naver-site-verification": NAVER_SITE_VERIFICATION,
        },
      },
    }),
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

  // 이전에는 여기서 headers()로 x-vercel-ip-country를 읽어 동의 배너 필요 여부를
  // 계산했다. headers()는 요청 시점 API라서 이 레이아웃 아래 모든 페이지가
  // 요청마다 서버에서 새로 렌더링되어 함수 CPU를 소모했다(Vercel Fluid Active CPU).
  // 판정 자체(needsConsentBanner)는 그대로 두고, 입력값만 proxy/middleware가
  // 심어 두는 geo-country 쿠키를 브라우저에서 읽도록 ConsentBanner 안으로 옮겼다.

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <GoogleAnalytics />
        <AdSenseScript />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <SiteHeader />
            {children}
            <SiteFooter />
            <ConsentBanner />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
