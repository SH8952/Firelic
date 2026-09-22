import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPolicyContent } from "@/content/policies";
import { PolicyPageView } from "@/components/PolicyPageView";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = getPolicyContent(locale).terms;
  const description = page.paragraphs[0];
  const url = `${SITE_URL}/${locale}/terms`;

  return {
    title: page.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: page.title, description, url, type: "website" },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PolicyPageView page={getPolicyContent(locale).terms} />;
}
