import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

type FaqItem = { question: string; answer: string };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Faq");
  const faqs: FaqItem[] = t.raw("items");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-xl text-sm text-[var(--color-text-secondary)]">
          {t("subtitle")}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {faqs.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
          >
            <summary className="cursor-pointer list-none text-sm font-medium text-[var(--color-text-primary)] marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="shrink-0 text-[var(--color-text-secondary)] transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
