"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/Slider";
import { CurrencySelector, currencySymbolFor } from "@/components/CurrencySelector";
import type { ChartDataset } from "@/components/FireChart";
import { simulateFire, type YearPoint } from "@/lib/fireCalculations";
import { currencyRangeFor } from "@/lib/currencyRanges";
import { computeCoast, fatFireThreshold, presetFor, type FireType, type TypeInputs } from "@/lib/fireTypes";
import { trackEvent } from "@/lib/analytics";
import { ResultShare } from "@/components/result-share";
import { useSharePublish } from "@/lib/use-share-publish";
import { parseBoundedNumber, parseStringChoice, readSharedParams } from "@/lib/shared-params";

const FireChart = dynamic(() => import("@/components/FireChart").then((m) => m.FireChart), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]" />
  ),
});

function withUnit(value: string | number, unit: string): string {
  return unit ? `${value} ${unit}` : String(value);
}

// 결과 공유 링크의 통화 목록(CurrencySelector 와 동일)
const SHARE_CURRENCIES = ["USD", "EUR", "GBP", "KRW", "JPY"] as const;
const SHARE_KEYS = ["cur", "ca", "ra", "pf", "mc", "ex", "pt", "rr", "wr", "tx"];

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
      <p className="tabular-nums mt-1 text-center text-2xl font-bold text-[var(--color-text-primary)]">{value}</p>
      {sub ? <p className="mt-1 text-center text-xs text-[var(--color-text-secondary)]">{sub}</p> : null}
    </div>
  );
}

export function FireTypeCalculator({ type }: { type: FireType }) {
  const t = useTranslations("calculator");
  const c = useTranslations("FireTypes.calc");
  const tt = useTranslations("FireTypes");
  const [currency, setCurrency] = useState("USD");
  const [inputs, setInputs] = useState<TypeInputs>(() => presetFor(type, "USD"));

  // 공유 링크(?cur=KRW&ca=30&…)로 열었으면 입력값을 채운다. 잘못된 값은 무시하고 유형별 기본값을 유지한다.
  useEffect(() => {
    const p = readSharedParams();
    if (!p || !SHARE_KEYS.some((k) => p.has(k))) return;
    const code = parseStringChoice(p.get("cur"), SHARE_CURRENCIES) ?? "USD";
    const r = currencyRangeFor(code);
    const base = presetFor(type, code);
    const int = (v: number | null, fallback: number) => (v === null ? fallback : Math.round(v));
    const one = (v: number | null, fallback: number) => (v === null ? fallback : Math.round(v * 10) / 10);
    // 화면의 슬라이더 제약과 같다: 코스트 FIRE 만 은퇴 나이를 직접 고르고, 나머지 유형은 은퇴 나이 65 고정(현재 나이는 그보다 아래).
    const rawAge = int(parseBoundedNumber(p.get("ca"), 18, 80), base.currentAge);
    const age = type === "coast-fire" ? rawAge : Math.min(rawAge, base.retirementAge - 1);
    const retirementAge =
      type === "coast-fire"
        ? int(parseBoundedNumber(p.get("ra"), age + 1, 90), Math.min(90, Math.max(age + 1, base.retirementAge)))
        : base.retirementAge;
    const restored: TypeInputs = {
      currentAge: age,
      retirementAge,
      currentPortfolio: int(parseBoundedNumber(p.get("pf"), r.currentPortfolio.min, r.currentPortfolio.max), base.currentPortfolio),
      monthlyContribution: int(parseBoundedNumber(p.get("mc"), r.monthlyContribution.min, r.monthlyContribution.max), base.monthlyContribution),
      annualExpenses: int(parseBoundedNumber(p.get("ex"), r.annualExpenses.min, r.annualExpenses.max), base.annualExpenses),
      partTimeIncome:
        type === "barista-fire"
          ? int(parseBoundedNumber(p.get("pt"), 0, r.annualExpenses.max), base.partTimeIncome)
          : base.partTimeIncome,
      realReturnPct: one(parseBoundedNumber(p.get("rr"), 0, 15), base.realReturnPct),
      withdrawalRatePct: one(parseBoundedNumber(p.get("wr"), 2, 6), base.withdrawalRatePct),
      effectiveTaxRatePct: int(parseBoundedNumber(p.get("tx"), 0, 40), base.effectiveTaxRatePct),
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrency(code);
    setInputs(restored);
  }, [type]);

  const range = useMemo(() => currencyRangeFor(currency), [currency]);
  const symbol = currencySymbolFor(currency);
  const unit = t(`currencyUnits.${currency}`);
  const money = (v: number) => withUnit(`${symbol}${Math.round(v).toLocaleString()}`, unit);
  const ageText = (v: number | null) => (v === null ? t("notReached") : withUnit(v, t("fireAgeUnit")));
  const yearsText = (v: number | null) => (v === null ? t("notReached") : withUnit(v, t("yearsToFireUnit")));

  function update<K extends keyof TypeInputs>(key: K, value: TypeInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
    trackEvent("slider_adjust", { param_name: `${type}:${key}`, value });
  }
  function changeCurrency(code: string) {
    setCurrency(code);
    setInputs((prev) => presetFor(type, code, { currentAge: prev.currentAge, retirementAge: prev.retirementAge }));
    trackEvent("currency_change", { currency: code });
  }

  const sim = (annualExpenses: number) =>
    simulateFire(
      {
        currentAge: inputs.currentAge,
        targetAge: inputs.currentAge + 1,
        currentPortfolio: inputs.currentPortfolio,
        monthlyContribution: inputs.monthlyContribution,
        annualExpenses,
        realReturnPct: inputs.realReturnPct,
        withdrawalRatePct: inputs.withdrawalRatePct,
        effectiveTaxRatePct: inputs.effectiveTaxRatePct,
      },
      range.leanFireThreshold,
    );

  const netExpenses = type === "barista-fire" ? Math.max(0, inputs.annualExpenses - inputs.partTimeIncome) : inputs.annualExpenses;
  const main = useMemo(() => sim(netExpenses), [inputs, range.leanFireThreshold]); // eslint-disable-line react-hooks/exhaustive-deps
  const full = useMemo(() => sim(inputs.annualExpenses), [inputs, range.leanFireThreshold]); // eslint-disable-line react-hooks/exhaustive-deps
  const coast = useMemo(() => computeCoast(inputs), [inputs]);

  const toPoints = (rows: { age: number; balance: number }[]): YearPoint[] =>
    rows.map((r) => ({ age: r.age, balance: r.balance, phase: "accumulation" as const }));

  let datasets: ChartDataset[];
  if (type === "coast-fire") {
    datasets = [
      { label: c("lineYourPortfolio"), series: toPoints(coast.series), color: "var(--color-chart-accumulation)" },
      { label: c("lineCoastThreshold"), series: toPoints(coast.threshold), color: "var(--color-chart-withdrawal)", dashed: true },
    ];
  } else {
    datasets = [
      { label: t("accumulationPhase"), series: main.series.filter((p) => p.phase === "accumulation"), color: "var(--color-chart-accumulation)" },
      { label: t("withdrawalPhase"), series: main.series.filter((p) => p.phase === "withdrawal"), color: "var(--color-chart-withdrawal)" },
    ];
    if (type === "barista-fire") {
      datasets.push({ label: c("lineFullPath"), series: full.series.filter((p) => p.phase === "accumulation"), color: "var(--color-text-secondary)", dashed: true });
    }
  }

  const fatLine = fatFireThreshold(currency);
  const spendBand =
    inputs.annualExpenses <= range.leanFireThreshold ? c("bandLean") : inputs.annualExpenses >= fatLine ? c("bandFat") : c("bandMiddle");
  const yearsEarlier =
    main.fireAge !== null && full.fireAge !== null ? Math.max(0, Math.round((full.fireAge - main.fireAge) * 10) / 10) : null;

  // 공유 버튼에 현재 입력값(링크)과 결과 요약 문구를 올린다(유형별로 필요한 값만 링크에 담는다).
  const sharePath = `/calculators/${type}`;
  const shareQuery = useMemo(() => {
    const q = new URLSearchParams();
    q.set("cur", currency);
    q.set("ca", String(inputs.currentAge));
    if (type === "coast-fire") q.set("ra", String(inputs.retirementAge));
    q.set("pf", String(inputs.currentPortfolio));
    q.set("mc", String(inputs.monthlyContribution));
    q.set("ex", String(inputs.annualExpenses));
    if (type === "barista-fire") q.set("pt", String(inputs.partTimeIncome));
    q.set("rr", String(inputs.realReturnPct));
    q.set("wr", String(inputs.withdrawalRatePct));
    q.set("tx", String(inputs.effectiveTaxRatePct));
    return q.toString();
  }, [currency, inputs, type]);
  const shareName = tt(`${type}.name`);
  const shareText =
    type === "coast-fire"
      ? c("shareTextCoast", { name: shareName, number: money(coast.coastNumber), progress: `${coast.progressPct.toFixed(1)}%` })
      : c("shareText", { name: shareName, number: money(main.fireNumber), age: ageText(main.fireAge) });
  useSharePublish(sharePath, shareQuery, shareText);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
      <section className="flex flex-col gap-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:sticky lg:top-6 lg:h-fit">
        <CurrencySelector value={currency} onChange={changeCurrency} label={t("currency")} />
        <Slider label={t("currentAge")} value={inputs.currentAge} min={18} max={80} suffix={t("fireAgeUnit")} onChange={(v) => update("currentAge", Math.min(v, inputs.retirementAge - 1))} />
        {type === "coast-fire" ? (
          <Slider label={c("retirementAge")} value={inputs.retirementAge} min={inputs.currentAge + 1} max={90} suffix={t("fireAgeUnit")} onChange={(v) => update("retirementAge", v)} />
        ) : null}
        <Slider label={t("currentPortfolio")} value={inputs.currentPortfolio} min={range.currentPortfolio.min} max={range.currentPortfolio.max} step={range.currentPortfolio.step} suffix={symbol} onChange={(v) => update("currentPortfolio", v)} />
        <Slider label={t("monthlyContribution")} value={inputs.monthlyContribution} min={range.monthlyContribution.min} max={range.monthlyContribution.max} step={range.monthlyContribution.step} suffix={symbol} onChange={(v) => update("monthlyContribution", v)} />
        <Slider label={t("annualExpenses")} value={inputs.annualExpenses} min={range.annualExpenses.min} max={range.annualExpenses.max} step={range.annualExpenses.step} suffix={symbol} onChange={(v) => update("annualExpenses", v)} />
        {type === "barista-fire" ? (
          <Slider label={c("partTimeIncome")} value={inputs.partTimeIncome} min={0} max={range.annualExpenses.max} step={range.annualExpenses.step} suffix={symbol} onChange={(v) => update("partTimeIncome", v)} />
        ) : null}
        <Slider label={t("realReturn")} value={inputs.realReturnPct} min={0} max={15} step={0.1} suffix="%" onChange={(v) => update("realReturnPct", v)} />
        <Slider label={t("withdrawalRate")} value={inputs.withdrawalRatePct} min={2} max={6} step={0.1} suffix="%" onChange={(v) => update("withdrawalRatePct", v)} />
        <Slider label={t("effectiveTaxRate")} value={inputs.effectiveTaxRatePct} min={0} max={40} step={1} suffix="%" onChange={(v) => update("effectiveTaxRatePct", v)} />
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex justify-end">
          <ResultShare path={sharePath} title={tt(`${type}.h1`)} text={tt(`${type}.description`)} />
        </div>
        {type === "coast-fire" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card label={c("coastNumber")} value={money(coast.coastNumber)} sub={c("coastNumberSub", { fire: money(coast.fireNumber), age: inputs.retirementAge })} />
            <Card label={c("coastProgress")} value={`${coast.progressPct.toFixed(1)}%`} sub={coast.reached ? c("coastReached") : c("coastNotYet")} />
            <Card label={c("coastAge")} value={ageText(coast.coastAge)} sub={coast.coastAge === null ? c("coastAgeNone") : undefined} />
            <Card label={c("projectedAtRetirement")} value={money(coast.projectedAtRetirement)} sub={c("projectedSub")} />
          </div>
        ) : type === "barista-fire" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card label={c("baristaNumber")} value={money(main.fireNumber)} sub={c("baristaNumberSub", { net: money(netExpenses) })} />
            <Card label={c("fullNumber")} value={money(full.fireNumber)} sub={c("fullNumberSub", { diff: money(Math.max(0, full.fireNumber - main.fireNumber)) })} />
            <Card label={c("baristaAge")} value={ageText(main.fireAge)} sub={yearsText(main.yearsToFire)} />
            <Card label={c("yearsEarlier")} value={yearsEarlier === null ? t("notReached") : withUnit(yearsEarlier, t("yearsToFireUnit"))} sub={c("yearsEarlierSub", { age: ageText(full.fireAge) })} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card label={t("fireNumber")} value={money(main.fireNumber)} />
            <Card label={t("fireAge")} value={ageText(main.fireAge)} />
            <Card label={t("yearsToFire")} value={yearsText(main.yearsToFire)} />
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)] sm:col-span-3">
              <p>{c("monthlySpend", { amount: money(inputs.annualExpenses / 12) })}</p>
              <p className="mt-1">{c("spendBand", { band: spendBand })}</p>
            </div>
          </div>
        )}
        <FireChart datasets={datasets} currencySymbol={symbol} showLegend />
      </section>
    </div>
  );
}

