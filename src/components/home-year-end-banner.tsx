import { Link } from "@/i18n/navigation";

/** 홈의 연말정산 배너 카드(한국어 전용, 2026-10-24 신설). 다른 언어에서는 렌더링하지 않는다. */
export function HomeYearEndBanner({ locale }: { locale: string }) {
  if (locale !== "ko") return null;
  return (
    <section className="mx-auto mt-12 w-full max-w-6xl px-4">
      <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-primary)] bg-[var(--color-surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-[var(--color-primary)]">연말정산 시즌</p>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">12월에 연금·카드로 환급이 얼마나 늘까?</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            총급여와 카드·연금·월세·의료비를 넣으면 예상 환급액과 계산 과정을 바로 보여 드립니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={"/year-end-tax/calculator" as never}
            className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-background)] hover:opacity-90"
          >
            환급 계산기 바로가기
          </Link>
          <Link
            href={"/year-end-tax" as never}
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
          >
            연말정산 가이드
          </Link>
        </div>
      </div>
    </section>
  );
}
