import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * 사이트 전용 404 화면 — 헤더/푸터는 [locale]/layout이 그대로 감싼다.
 * notFound()(존재하지 않는 가이드/블로그 주소 포함)와 catch-all 라우트가 이 화면을 쓴다.
 * 응답 상태 코드는 Next.js가 404로 유지한다.
 */
export default async function LocaleNotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center">
      <p className="text-sm font-semibold tracking-widest text-[var(--color-primary)]">
        404
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
        {t("title")}
      </h1>
      <p className="max-w-md text-[var(--color-text-secondary)]">{t("description")}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {t("home")}
        </Link>
        <Link
          href="/guides"
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
        >
          {t("guides")}
        </Link>
        <Link
          href="/faq"
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
        >
          {t("faq")}
        </Link>
      </div>
    </div>
  );
}
