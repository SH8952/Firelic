import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllGuidesMeta } from "@/lib/guides";

/**
 * 홈페이지 "가이드 하이라이트" 카드 섹션 — 계산기 위젯만 있던 홈페이지에
 * 크롤링 가능한 텍스트/링크를 추가하기 위한 최소 침습적 추가.
 *
 * firelic은 AdSense 심사가 아직 "Getting Ready" 상태이므로, 기존 계산기 UI나
 * 구조는 건드리지 않고 이 섹션 하나만 하단에 추가한다(대규모 구조 변경 지양).
 */
export async function HomeGuideHighlights({ locale }: { locale: string }) {
  const t = await getTranslations("home");
  const guides = getAllGuidesMeta(locale).slice(0, 3);

  if (guides.length === 0) return null;

  return (
    <section className="mx-auto mt-12 flex w-full max-w-5xl flex-col gap-4 border-t border-[var(--color-border)] px-4 pt-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {t("guideHighlightsTitle")}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t("guideHighlightsSubtitle")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-primary)]"
          >
            {guide.image ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-[var(--color-border)]">
                <Image
                  src={guide.image}
                  alt={guide.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-1.5">
              <h3 className="font-semibold leading-snug text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                {guide.title}
              </h3>
              <p className="line-clamp-3 text-sm text-[var(--color-text-secondary)]">
                {guide.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/guides"
        className="text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        {t("guideHighlightsCta")}
      </Link>
    </section>
  );
}
