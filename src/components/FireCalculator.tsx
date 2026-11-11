"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { Slider } from "@/components/Slider";
import { ResultCards } from "@/components/ResultCards";
import type { ChartDataset } from "@/components/FireChart";
import { CurrencySelector, currencySymbolFor } from "@/components/CurrencySelector";
import { ScenarioTabs } from "@/components/ScenarioTabs";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ResultInsights } from "@/components/ResultInsights";
import { AdSlot } from "@/components/AdSlot";
import { UsageGuideSection } from "@/components/UsageGuideSection";
import { simulateFire, type FireInputs } from "@/lib/fireCalculations";
import { currencyRangeFor, type CurrencyRangeConfig } from "@/lib/currencyRanges";
import { trackEvent } from "@/lib/analytics";
import { ResultShare } from "@/components/result-share";
import { useSharePublish } from "@/lib/use-share-publish";
import { parseBoundedNumber, parseStringChoice, readSharedParams } from "@/lib/shared-params";
import { formatNum } from "@/lib/formatNum";

// Chart.js + react-chartjs-2 are a sizeable chunk of client JS that isn't
// needed to paint the calculator's inputs/results. Loading it via
// next/dynamic (ssr:false) splits it into its own chunk fetched after the
// initial page JS, instead of blocking first paint/hydration on it.
// A fixed-height skeleton avoids layout shift while it loads.
const FireChart = dynamic(
  () => import("@/components/FireChart").then((mod) => mod.FireChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]" />
    ),
  }
);

const DEFAULT_INPUTS: FireInputs = {
  currentAge: 30,
  targetAge: 45,
  currentPortfolio: 50000,
  monthlyContribution: 1500,
  annualExpenses: 40000,
  realReturnPct: 6,
  withdrawalRatePct: 4,
  effectiveTaxRatePct: 15,
};

const DEFAULT_INPUTS_B: FireInputs = {
  ...DEFAULT_INPUTS,
  targetAge: 60,
  monthlyContribution: 800,
};


type CurrencyScaledField = "currentPortfolio" | "monthlyContribution" | "annualExpenses";

// Switching currency only changes a display symbol under the hood unless we
// also rescale these three fields — otherwise e.g. a $50,000 portfolio stays
// literally "50,000" after switching to KRW, which reads as a trivial amount
// and the slider's USD-scale max blocks entering a realistic won figure.
// Rescale proportionally (relative to each currency's default) so a value the
// user already customized keeps its relative size in the new currency, rather
// than being reset outright. (공유 링크 복원에서도 같은 환산을 쓰도록 모듈 함수로 분리)
function rescaleInputsBetween(
  target: FireInputs,
  prevRange: CurrencyRangeConfig,
  nextRange: CurrencyRangeConfig,
): FireInputs {
  const rescale = (value: number, field: CurrencyScaledField) => {
    const prevDefault = prevRange[field].default;
    const nextDefault = nextRange[field].default;
    const scaled = prevDefault > 0 ? Math.round((value / prevDefault) * nextDefault) : nextDefault;
    return Math.min(nextRange[field].max, Math.max(nextRange[field].min, scaled));
  };
  return {
    ...target,
    currentPortfolio: rescale(target.currentPortfolio, "currentPortfolio"),
    monthlyContribution: rescale(target.monthlyContribution, "monthlyContribution"),
    annualExpenses: rescale(target.annualExpenses, "annualExpenses"),
  };
}

// 결과 공유 링크의 통화 목록(CurrencySelector 와 동일)
const SHARE_CURRENCIES = ["USD", "EUR", "GBP", "KRW", "JPY"] as const;
const SHARE_KEYS = ["cur", "ca", "ta", "pf", "mc", "ex", "rr", "wr", "tx"];

function withUnit(value: string | number, unit: string): string {
  return unit ? `${value} ${unit}` : String(value);
}

export function FireCalculator() {
  const t = useTranslations("calculator");
  const locale = useLocale();
  const [scenarios, setScenarios] = useState<{ A: FireInputs; B: FireInputs }>({
    A: DEFAULT_INPUTS,
    B: DEFAULT_INPUTS_B,
  });
  const [activeScenario, setActiveScenario] = useState<"A" | "B">("A");
  const [compareMode, setCompareMode] = useState(false);
  const [currency, setCurrency] = useState("USD");

  const inputs = scenarios[activeScenario];
  const range = useMemo(() => currencyRangeFor(currency), [currency]);
  const resultA = useMemo(
    () => simulateFire(scenarios.A, range.leanFireThreshold),
    [scenarios.A, range.leanFireThreshold],
  );
  const resultB = useMemo(
    () => simulateFire(scenarios.B, range.leanFireThreshold),
    [scenarios.B, range.leanFireThreshold],
  );
  const activeResult = activeScenario === "A" ? resultA : resultB;

  useEffect(() => {
    trackEvent("fire_result_view", {
      fire_age: activeResult.fireAge ?? undefined,
      years_to_fire: activeResult.yearsToFire ?? undefined,
    });
  }, [activeResult.fireAge, activeResult.yearsToFire]);
  const currencySymbol = currencySymbolFor(currency);
  const currencyUnit = t(`currencyUnits.${currency}`);

  // 공유 링크(?cur=KRW&ca=30&…)로 열었으면 입력값을 채운다. 잘못된 값은 무시하고 기본값을 유지한다.
  // 결과 공유 링크는 현재 보고 있던 시나리오의 입력값을 시나리오 A 로 복원한다.
  useEffect(() => {
    const p = readSharedParams();
    if (!p || !SHARE_KEYS.some((k) => p.has(k))) return;
    const code = parseStringChoice(p.get("cur"), SHARE_CURRENCIES) ?? "USD";
    const usd = currencyRangeFor("USD");
    const r = currencyRangeFor(code);
    const baseA = rescaleInputsBetween(DEFAULT_INPUTS, usd, r);
    const baseB = rescaleInputsBetween(DEFAULT_INPUTS_B, usd, r);
    const int = (v: number | null, fallback: number) => (v === null ? fallback : Math.round(v));
    const one = (v: number | null, fallback: number) => (v === null ? fallback : Math.round(v * 10) / 10);
    const currentAge = int(parseBoundedNumber(p.get("ca"), 18, 80), baseA.currentAge);
    const targetAge = int(
      parseBoundedNumber(p.get("ta"), currentAge + 1, 90),
      Math.min(90, Math.max(currentAge + 1, baseA.targetAge)),
    );
    const restored: FireInputs = {
      currentAge,
      targetAge,
      currentPortfolio: int(parseBoundedNumber(p.get("pf"), r.currentPortfolio.min, r.currentPortfolio.max), baseA.currentPortfolio),
      monthlyContribution: int(parseBoundedNumber(p.get("mc"), r.monthlyContribution.min, r.monthlyContribution.max), baseA.monthlyContribution),
      annualExpenses: int(parseBoundedNumber(p.get("ex"), r.annualExpenses.min, r.annualExpenses.max), baseA.annualExpenses),
      realReturnPct: one(parseBoundedNumber(p.get("rr"), 0, 15), baseA.realReturnPct),
      withdrawalRatePct: one(parseBoundedNumber(p.get("wr"), 2, 6), baseA.withdrawalRatePct),
      effectiveTaxRatePct: int(parseBoundedNumber(p.get("tx"), 0, 40), baseA.effectiveTaxRatePct),
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrency(code);
    setScenarios({ A: restored, B: baseB });
    setActiveScenario("A");
  }, []);

  // 공유 버튼에 현재 입력값(링크)과 결과 요약 문구를 올린다.
  const shareQuery = useMemo(() => {
    const q = new URLSearchParams();
    q.set("cur", currency);
    q.set("ca", String(inputs.currentAge));
    q.set("ta", String(inputs.targetAge));
    q.set("pf", String(inputs.currentPortfolio));
    q.set("mc", String(inputs.monthlyContribution));
    q.set("ex", String(inputs.annualExpenses));
    q.set("rr", String(inputs.realReturnPct));
    q.set("wr", String(inputs.withdrawalRatePct));
    q.set("tx", String(inputs.effectiveTaxRatePct));
    return q.toString();
  }, [currency, inputs]);
  const shareText = t("shareText", {
    fireNumber: withUnit(`${currencySymbol}${Math.round(activeResult.fireNumber).toLocaleString(locale)}`, currencyUnit),
    fireAge: activeResult.fireAge !== null ? withUnit(formatNum(activeResult.fireAge, locale), t("fireAgeUnit")) : t("notReached"),
    years: activeResult.yearsToFire !== null ? withUnit(formatNum(activeResult.yearsToFire, locale), t("yearsToFireUnit")) : t("notReached"),
  });
  useSharePublish("", shareQuery, shareText);

  function update<K extends keyof FireInputs>(key: K, value: FireInputs[K]) {
    setScenarios((prev) => ({
      ...prev,
      [activeScenario]: { ...prev[activeScenario], [key]: value },
    }));
    trackEvent("slider_adjust", { param_name: key, value });
  }

  function handleCurrencyChange(nextCode: string) {
    const prevRange = range;
    const nextRange = currencyRangeFor(nextCode);
    const rescaleInputs = (target: FireInputs): FireInputs => rescaleInputsBetween(target, prevRange, nextRange);
    setScenarios((prev) => ({ A: rescaleInputs(prev.A), B: rescaleInputs(prev.B) }));
    setCurrency(nextCode);
    trackEvent("currency_change", { currency: nextCode });
  }

  const chartDatasets: ChartDataset[] = compareMode
    ? [
        { label: `${t("scenarioA")} · ${t("accumulationPhase")}`, series: resultA.series.filter((p) => p.phase === "accumulation"), color: "var(--color-chart-accumulation)" },
        { label: `${t("scenarioA")} · ${t("withdrawalPhase")}`, series: resultA.series.filter((p) => p.phase === "withdrawal"), color: "var(--color-chart-accumulation)", dashed: true },
        { label: `${t("scenarioB")} · ${t("accumulationPhase")}`, series: resultB.series.filter((p) => p.phase === "accumulation"), color: "var(--color-chart-withdrawal)" },
        { label: `${t("scenarioB")} · ${t("withdrawalPhase")}`, series: resultB.series.filter((p) => p.phase === "withdrawal"), color: "var(--color-chart-withdrawal)", dashed: true },
      ]
    : [
        { label: t("accumulationPhase"), series: activeResult.series.filter((p) => p.phase === "accumulation"), color: "var(--color-chart-accumulation)" },
        { label: t("withdrawalPhase"), series: activeResult.series.filter((p) => p.phase === "withdrawal"), color: "var(--color-chart-withdrawal)" },
      ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AdSlot variant="display" label={t("adDisplay")} />

      <div className="mt-6 mb-6">
        <ScenarioTabs
          active={activeScenario}
          onChange={(s) => {
            setActiveScenario(s);
            trackEvent("scenario_compare_start", {});
          }}
          compareMode={compareMode}
          badges={
            compareMode
              ? undefined
              : {
                  coastFire: t("coastFire"),
                  leanFire: t("leanFire"),
                  isCoastFire: activeResult.isCoastFire,
                  isLeanFire: activeResult.isLeanFire,
                }
          }
          onToggleCompare={() => {
            setCompareMode((v) => !v);
            trackEvent("scenario_compare_start", {});
          }}
          labels={{
            scenarioA: t("scenarioA"),
            scenarioB: t("scenarioB"),
            compare: t("compareScenarios"),
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
        <section className="flex flex-col gap-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:sticky lg:top-6 lg:h-fit">
          <CurrencySelector value={currency} onChange={handleCurrencyChange} label={t("currency")} />
          <Slider label={t("currentAge")} value={inputs.currentAge} min={18} max={80} suffix={t("fireAgeUnit")} onChange={(v) => update("currentAge", v)} />
          <Slider label={t("targetAge")} value={inputs.targetAge} min={inputs.currentAge + 1} max={90} suffix={t("fireAgeUnit")} onChange={(v) => update("targetAge", v)} />
          <Slider
            label={t("currentPortfolio")}
            value={inputs.currentPortfolio}
            min={range.currentPortfolio.min}
            max={range.currentPortfolio.max}
            step={range.currentPortfolio.step}
            suffix={currencySymbol}
            onChange={(v) => update("currentPortfolio", v)}
          />
          <Slider
            label={t("monthlyContribution")}
            value={inputs.monthlyContribution}
            min={range.monthlyContribution.min}
            max={range.monthlyContribution.max}
            step={range.monthlyContribution.step}
            suffix={currencySymbol}
            onChange={(v) => update("monthlyContribution", v)}
          />
          <Slider
            label={t("annualExpenses")}
            value={inputs.annualExpenses}
            min={range.annualExpenses.min}
            max={range.annualExpenses.max}
            step={range.annualExpenses.step}
            suffix={currencySymbol}
            onChange={(v) => update("annualExpenses", v)}
          />
          <Slider label={t("realReturn")} value={inputs.realReturnPct} min={0} max={15} step={0.1} suffix="%" onChange={(v) => update("realReturnPct", v)} />
          <Slider label={t("withdrawalRate")} value={inputs.withdrawalRatePct} min={2} max={6} step={0.1} suffix="%" onChange={(v) => update("withdrawalRatePct", v)} />
          <Slider label={t("effectiveTaxRate")} value={inputs.effectiveTaxRatePct} min={0} max={40} step={1} suffix="%" onChange={(v) => update("effectiveTaxRatePct", v)} />
        </section>

        <section className="flex flex-col gap-6">
          {compareMode ? (
            <ComparisonTable
              resultA={resultA}
              resultB={resultB}
              currencySymbol={currencySymbol}
              currencyUnit={currencyUnit}
              labels={{
                metric: t("metric"),
                scenarioA: t("scenarioA"),
                scenarioB: t("scenarioB"),
                fireNumber: t("fireNumber"),
                fireAge: t("fireAge"),
                yearsToFire: t("yearsToFire"),
                notReached: t("notReached"),
                ageUnit: t("fireAgeUnit"),
                yearsUnit: t("yearsToFireUnit"),
              }}
            />
          ) : (
            <ResultCards
              fireNumber={activeResult.fireNumber}
              fireAge={activeResult.fireAge}
              yearsToFire={activeResult.yearsToFire}
              currencySymbol={currencySymbol}
              currencyUnit={currencyUnit}
              labels={{
                fireNumber: t("fireNumber"),
                fireAge: t("fireAge"),
                yearsToFire: t("yearsToFire"),
                notReached: t("notReached"),
                ageUnit: t("fireAgeUnit"),
                yearsUnit: t("yearsToFireUnit"),
              }}
            />
          )}

          <div className="flex justify-end">
            <ResultShare path="" title={t("title")} text={t("subtitle")} />
          </div>

          <FireChart datasets={chartDatasets} currencySymbol={currencySymbol} showLegend={compareMode} />

          {!compareMode && (
            <ResultInsights
              inputs={inputs}
              result={activeResult}
              leanThreshold={range.leanFireThreshold}
              currencySymbol={currencySymbol}
              currencyUnit={currencyUnit}
            />
          )}

          <AdSlot variant="native" label={t("adNative")} />

        </section>
      </div>

      <div className="mt-10">
        <UsageGuideSection />
      </div>
    </div>
  );
}
