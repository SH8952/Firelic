import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type FaqItem = { question: string; answer: string };

/**
 * 홈페이지 "FAQ 하이라이트" 섹션 — /faq 페이지의 전체 질문 목록(Faq.items) 중
 * 5개를 무작위로 뽑아 홈페이지에도 노출한다(Fisher-Yates 셔플).
 *
 * FAQPage 구조화 데이터(JSON-LD)는 이 섹션에서 실제로 렌더링되는 5개 항목만
 * 포함한다 — 화면에 없는 질문까지 JSON-LD에 넣는 것은 구글 가이드라인 위반이므로
 * 반드시 노출된 항목으로만 범위를 한정한다.
 *
 * [2026-09-27] 신규 추가 — guide-highlights-and-faq-highlights-rollout-guide.md
 * 참고(ExifLens 선례). firelic은 FAQ가 다중 소스가 아닌 단일 네임스페이스(Faq.items)
 * 이므로 ExifLens의 collectToolFaqs() 같은 취합 로직 없이 바로 사용한다.
 */
function pickRandomFaqs<T>(items: T[], count: number): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export async function HomeFaqHighlights({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tFaq = await getTranslations({ locale, namespace: "Faq" });
  const allFaqs: FaqItem[] = tFaq.raw("items");
  const faqs = pickRandomFaqs(allFaqs, 5);

  if (faqs.length === 0) return null;

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
    <section className="mx-auto mt-12 flex w-full max-w-5xl flex-col gap-4 border-t border-[var(--color-border)] px-4 pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {t("faqHighlightsTitle")}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t("faqHighlightsSubtitle")}
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

      <Link
        href="/faq"
        className="text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        {t("faqHighlightsCta")}
      </Link>
    </section>
  );
}
