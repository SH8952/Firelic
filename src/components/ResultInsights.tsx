"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatNum } from "@/lib/formatNum";
import type { FireInputs, FireResult } from "@/lib/fireCalculations";
import { buildLevers, buildSensitivity } from "@/lib/fireInsights";

type Props = {
  inputs: FireInputs;
  result: FireResult;
  leanThreshold: number;
  currencySymbol: string;
  currencyUnit: string;
};

function withUnit(value: string | number, unit: string): string {
  return unit ? `${value} ${unit}` : String(value);
}

export function ResultInsights({ inputs, result, leanThreshold, currencySymbol, currencyUnit }: Props) {
  const t = useTranslations("calculator");
  const locale = useLocale();
  const ageUnit = t("fireAgeUnit");
  const yearsUnit = t("yearsToFireUnit");
  const yearsUnitOne = t("yearsToFireUnitOne");
  const n = (v: number) => formatNum(v, locale);
  const yrs = (v: number) => withUnit(n(v), v === 1 ? yearsUnitOne : yearsUnit);

  const levers = useMemo(() => buildLevers(inputs, leanThreshold), [inputs, leanThreshold]);
  const grid = useMemo(() => buildSensitivity(inputs, leanThreshold), [inputs, leanThreshold]);

  const money = (v: number) => withUnit(`${currencySymbol}${Math.round(v).toLocaleString(locale)}`, currencyUnit);
  const pct = result.fireNumber > 0 ? Math.min(100, (inputs.currentPortfolio / result.fireNumber) * 100) : 0;
  const pctText = pct >= 10 ? formatNum(Math.round(pct), locale, 0) : formatNum(pct, locale, 1, 1);

  let summary: string;
  if (result.fireAge === null) {
    summary = t("insights.summaryUnreachable", { amount: money(result.fireNumber) });
  } else {
    const diff = Math.round(Math.abs(inputs.targetAge - result.fireAge) * 10) / 10;
    const key = result.fireAge <= inputs.targetAge ? "summaryAhead" : "summaryBehind";
    summary = t(`insights.${key}`, {
      age: withUnit(n(result.fireAge), ageUnit),
      amount: money(result.fireNumber),
      target: withUnit(n(inputs.targetAge), ageUnit),
      diff: yrs(diff),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{t("insights.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{summary}</p>
        <div className="mt-4">
          <div className="flex items-baseline justify-between text-sm text-[var(--color-text-secondary)]">
            <span>{t("insights.progressLabel")}</span>
            <span className="tabular-nums font-semibold text-[var(--color-text-primary)]">{pctText}%</span>
          </div>
          <div
            className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--color-border)]"
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("insights.progressLabel")}
          >
            <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            {t("insights.progressDetail", { current: money(inputs.currentPortfolio), goal: money(result.fireNumber) })}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{t("insights.leversTitle")}</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t("insights.leversDesc")}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {levers.map((l) => (
            <li
              key={l.key}
              className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-[var(--color-text-primary)]">{t(`insights.${l.key}`)}</span>
              <span className="tabular-nums text-[var(--color-text-secondary)]">
                {l.fireAge === null
                  ? t("notReached")
                  : l.yearsSooner && l.yearsSooner > 0
                    ? t("insights.leverResult", {
                        age: withUnit(n(l.fireAge), ageUnit),
                        diff: yrs(l.yearsSooner),
                      })
                    : t("insights.leverNoChange", { age: withUnit(n(l.fireAge), ageUnit) })}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{t("insights.sensTitle")}</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t("insights.sensDesc")}</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-center text-sm">
            <caption className="sr-only">{t("insights.sensTitle")}</caption>
            <thead>
              <tr>
                <th scope="col" className="p-2 text-left text-xs font-medium text-[var(--color-text-secondary)]">
                  {t("insights.sensCorner")}
                </th>
                {grid.contributions.map((c, ci) => (
                  <th
                    key={c}
                    scope="col"
                    className={`tabular-nums p-2 text-xs font-medium ${
                      ci === grid.baseCol ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {currencySymbol}
                    {c.toLocaleString(locale)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.returns.map((r, ri) => (
                <tr key={r}>
                  <th
                    scope="row"
                    className={`tabular-nums p-2 text-left text-xs font-medium ${
                      ri === grid.baseRow ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {n(r)}%
                  </th>
                  {grid.cells[ri].map((age, ci) => {
                    const isBase = ri === grid.baseRow && ci === grid.baseCol;
                    return (
                      <td
                        key={ci}
                        className={`tabular-nums border border-[var(--color-border)] p-2 ${
                          isBase
                            ? "bg-[var(--color-accent)] font-bold text-[#12271C]"
                            : "text-[var(--color-text-primary)]"
                        }`}
                      >
                        {age === null ? "—" : withUnit(n(age), ageUnit)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">{t("insights.sensNote")}</p>
      </section>
    </div>
  );
}
