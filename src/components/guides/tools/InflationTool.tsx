"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/Slider";
import { ResultRow, ToolFrame, Verdict, money } from "./tool-parts";

export function InflationTool() {
  const t = useTranslations("GuideTools.infl");
  const [expenses, setExpenses] = useState(40000);
  const [inflation, setInflation] = useState(3);
  const [years, setYears] = useState(15);
  const [swr, setSwr] = useState(4);

  const future = (rate: number) => expenses * Math.pow(1 + rate / 100, years);
  const fireToday = expenses / (swr / 100);
  const fireFuture = future(inflation) / (swr / 100);

  return (
    <ToolFrame
      title={t("title")}
      inputs={
        <>
          <Slider label={t("expenses")} value={expenses} min={10000} max={200000} step={1000} suffix="$" onChange={setExpenses} />
          <Slider label={t("inflation")} value={inflation} min={0} max={8} step={0.1} suffix="%" onChange={setInflation} />
          <Slider label={t("years")} value={years} min={1} max={40} step={1} onChange={setYears} />
          <Slider label={t("swr")} value={swr} min={2} max={6} step={0.1} suffix="%" onChange={setSwr} />
        </>
      }
      results={
        <>
          <ResultRow label={t("fireToday")} value={money(fireToday)} />
          <ResultRow label={t("costFuture", { years })} value={money(future(inflation))} />
          <ResultRow label={t("fireFuture")} value={money(fireFuture)} strong />
          <ResultRow label={t("extra")} value={money(fireFuture - fireToday)} />
          <p className="pt-2 text-sm font-semibold text-[var(--color-text-primary)]">{t("tableTitle")}</p>
          {[2, 3, 4, 5].map((r) => (
            <ResultRow key={r} label={t("tableRow", { rate: r })} value={money(future(r) / (swr / 100))} />
          ))}
          <Verdict>{t("hint")}</Verdict>
        </>
      }
    />
  );
}
