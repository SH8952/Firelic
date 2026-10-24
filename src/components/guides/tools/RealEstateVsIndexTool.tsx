"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/Slider";
import { ResultRow, ToolFrame, Verdict, money } from "./tool-parts";

type S = { cash: number; downPct: number; appreciation: number; rate: number; rentYield: number; expenseRatio: number; indexReturn: number; years: number; sellCost: number };
const DEFAULTS: S = { cash: 100000, downPct: 25, appreciation: 4, rate: 6, rentYield: 8, expenseRatio: 30, indexReturn: 7, years: 10, sellCost: 6 };

/** 월 상환액(원리금균등) */
function monthlyPayment(loan: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 12;
  return r === 0 ? loan / months : (loan * r) / (1 - Math.pow(1 + r, -months));
}
function balanceAfter(loan: number, annualRatePct: number, totalMonths: number, paidMonths: number): number {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return Math.max(0, loan - (loan / totalMonths) * paidMonths);
  const pay = monthlyPayment(loan, annualRatePct, totalMonths);
  return Math.max(0, loan * Math.pow(1 + r, paidMonths) - pay * ((Math.pow(1 + r, paidMonths) - 1) / r));
}

export function RealEstateVsIndexTool() {
  const t = useTranslations("GuideTools.re");
  const [s, setS] = useState<S>(DEFAULTS);
  const set = <K extends keyof S>(k: K, v: S[K]) => setS((p) => ({ ...p, [k]: v }));

  const price = s.cash / (s.downPct / 100);
  const loan = price - s.cash;
  const termMonths = 360;
  const heldMonths = Math.min(s.years * 12, termMonths);
  const payYear = monthlyPayment(loan, s.rate, termMonths) * 12;
  const noi = price * (s.rentYield / 100) * (1 - s.expenseRatio / 100);
  const yearlyCf = noi - payYear;
  const value = price * Math.pow(1 + s.appreciation / 100, s.years);
  const left = balanceAfter(loan, s.rate, termMonths, heldMonths);
  const proceeds = value * (1 - s.sellCost / 100) - left;
  const cashFlow = yearlyCf * s.years;
  const reTotal = proceeds + cashFlow;
  const indexValue = s.cash * Math.pow(1 + s.indexReturn / 100, s.years);
  const diff = reTotal - indexValue;

  return (
    <ToolFrame
      title={t("title")}
      inputs={
        <>
          <Slider label={t("cash")} value={s.cash} min={20000} max={500000} step={5000} suffix="$" onChange={(v) => set("cash", v)} />
          <Slider label={t("downPct")} value={s.downPct} min={10} max={100} step={5} suffix="%" onChange={(v) => set("downPct", v)} />
          <Slider label={t("appreciation")} value={s.appreciation} min={-5} max={8} step={0.5} suffix="%" onChange={(v) => set("appreciation", v)} />
          <Slider label={t("rate")} value={s.rate} min={0} max={10} step={0.25} suffix="%" onChange={(v) => set("rate", v)} />
          <Slider label={t("rentYield")} value={s.rentYield} min={3} max={14} step={0.5} suffix="%" onChange={(v) => set("rentYield", v)} />
          <Slider label={t("expenseRatio")} value={s.expenseRatio} min={10} max={60} step={1} suffix="%" onChange={(v) => set("expenseRatio", v)} />
          <Slider label={t("indexReturn")} value={s.indexReturn} min={0} max={12} step={0.5} suffix="%" onChange={(v) => set("indexReturn", v)} />
          <Slider label={t("years")} value={s.years} min={3} max={30} step={1} onChange={(v) => set("years", v)} />
          <Slider label={t("sellCost")} value={s.sellCost} min={0} max={10} step={0.5} suffix="%" onChange={(v) => set("sellCost", v)} />
        </>
      }
      results={
        <>
          <ResultRow label={t("price")} value={money(price)} />
          <ResultRow label={t("annualCf")} value={money(yearlyCf)} />
          <ResultRow label={t("propertyValue")} value={money(value)} />
          <ResultRow label={t("loanLeft")} value={money(left)} />
          <ResultRow label={t("proceeds")} value={money(proceeds)} />
          <ResultRow label={t("cashFlowTotal")} value={money(cashFlow)} />
          <ResultRow label={t("reTotal")} value={money(reTotal)} strong />
          <ResultRow label={t("indexValue")} value={money(indexValue)} strong />
          <Verdict>{Math.abs(diff) < 1 ? t("tie") : diff > 0 ? t("reAhead", { diff: money(diff) }) : t("indexAhead", { diff: money(-diff) })}</Verdict>
          <p className="text-sm text-[var(--color-text-secondary)]">{t("hint")}</p>
        </>
      }
    />
  );
}
