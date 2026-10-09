"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * 예상치 못한 오류가 났을 때 보여주는 사이트 전용 화면 — 헤더/푸터는 유지되고
 * 본문 영역만 이 화면으로 바뀐다. "다시 시도"는 해당 구간만 다시 그린다.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
        {t("title")}
      </h1>
      <p className="max-w-md text-[var(--color-text-secondary)]">{t("description")}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
