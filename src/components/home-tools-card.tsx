import { Link } from "@/i18n/navigation";

/** 홈의 재무 도구 안내 카드(한국어 전용). 다른 언어에서는 렌더링하지 않는다. */
export function HomeToolsCard({ locale }: { locale: string }) {
  if (locale !== "ko") return null;
  return (
    <section className="mx-auto mt-8 w-full max-w-6xl px-4">
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">FIRE 준비 중 막히는 계산, 하나씩 풀어 보세요</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">비상금 목표 · 목표 금액 역산 · 복리 · 퇴직금 계산기</p>
        </div>
        <Link
          href={"/calculators" as never}
          className="shrink-0 rounded-full border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
        >
          계산기 전체 보기
        </Link>
      </div>
    </section>
  );
}
