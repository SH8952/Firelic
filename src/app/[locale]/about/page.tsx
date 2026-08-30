import { setRequestLocale } from "next-intl/server";
import { getPolicyContent } from "@/content/policies";
import { PolicyPageView } from "@/components/PolicyPageView";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PolicyPageView page={getPolicyContent(locale).about} />;
}
