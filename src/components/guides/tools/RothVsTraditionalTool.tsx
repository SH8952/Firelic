"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/Slider";
import { ResultRow, ToolFrame, Verdict, money } from "./tool-parts";

export function RothVsTraditionalTool() {
  const t = useTranslations("GuideTools.roth");
  const [amount, setAmount] = useState(10000);
  const [taxNow, setTaxNow] = useState(24);
  const [taxLater, setTaxLater] = useState(12);
  const [years, setYears] = useState(20);
  const [ret, setRet] = useState(7);

  const growth = Math.pow(1 + ret / 100, years);
  // 전통형: 세전 금액 전체가 불어난 뒤 인출할 때 은퇴 후 세율로 과세
  const traditional = amount * growth * (1 - taxLater / 100);
  // Roth: 지금 세금을 낸 나머지를 납입하고, 인출은 비과세
  const roth = amount * (1 - taxNow / 100) * growth;
  const diff = roth - traditional;

  return (
    <ToolFrame
      title={t("title")}
      inputs={
        <>
          <Slider label={t("amount")} value={amount} min={1000} max={50000} step={500} suffix="$" onChange={setAmount} />
          <Slider label={t("taxNow")} value={taxNow} min={0} max={40} step={1} suffix="%" onChange={setTaxNow} />
          <Slider label={t("taxLater")} value={taxLater} min={0} max={40} step={1} suffix="%" onChange={setTaxLater} />
          <Slider label={t("years")} value={years} min={1} max={40} step={1} onChange={setYears} />
          <Slider label={t("ret")} value={ret} min={0} max={12} step={0.5} suffix="%" onChange={setRet} />
        </>
      }
      results={
        <>
          <ResultRow label={t("tradValue")} value={money(traditional)} strong />
          <ResultRow label={t("rothValue")} value={money(roth)} strong />
          <Verdict>
            {Math.abs(diff) < 1 ? t("tie") : diff > 0 ? t("rothAhead", { diff: money(diff) }) : t("tradAhead", { diff: money(-diff) })}
          </Verdict>
          <p className="text-sm text-[var(--color-text-secondary)]">{t("hint")}</p>
        </>
      }
    />
  );
}
