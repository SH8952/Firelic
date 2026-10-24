import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FIRE_TYPES } from "@/lib/fireTypes";

/** 홈 하단의 FIRE 유형별 계산기 링크 카드(코스트·바리스타·린·팻). 계산기 구조는 그대로 두고 링크 섹션만 추가. */
export async function HomeFireTypes({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const f = await getTranslations({ locale, namespace: "FireTypes" });
  return (
    <section className="mx-auto mt-12 flex w-full max-w-6xl flex-col gap-4 border-t border-[var(--color-border)] px-4 pt-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{t("fireTypesTitle")}</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">{t("fireTypesSubtitle")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FIRE_TYPES.map((type) => (
          <Link
            key={type}
            href={`/calculators/${type}`}
            className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-primary)]"
          >
            <h3 className="font-semibold text-[var(--color-text-primary)]">{f(`${type}.name`)}</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">{f(`${type}.short`)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
