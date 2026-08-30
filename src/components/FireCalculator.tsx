"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/Slider";
import { ResultCards } from "@/components/ResultCards";
import { FireChart, type ChartDataset } from "@/components/FireChart";
import { CurrencySelector, currencySymbolFor } from "@/components/CurrencySelector";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScenarioTabs } from "@/components/ScenarioTabs";
import { ComparisonTable } from "@/components/ComparisonTable";
import { AdSlot } from "@/components/AdSlot";
import { AffiliateBanner } from "@/components/AffiliateBanner";
import { simulateFire, type FireInputs } from "@/lib/fireCalculations";
import { trackEvent } from "@/lib/analytics";

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

const AFFILIATE_PARTNERS = [
  { name: "Interactive Brokers", href: "#" },
  { name: "eToro", href: "#" },
  { name: "Webull", href: "#" },
];

export function FireCalculator() {
  const t = useTranslations("calculator");
  const [scenarios, setScenarios] = useState<{ A: FireInputs; B: FireInputs }>({
    A: DEFAULT_INPUTS,
    B: DEFAULT_INPUTS_B,
  });
  const [activeScenario, setActiveScenario] = useState<"A" | "B">("A");
  const [compareMode, setCompareMode] = useState(false);
  const [currency, setCurrency] = useState("USD");

  const inputs = scenarios[activeScenario];
  const resultA = useMemo(() => simulateFire(scenarios.A), [scenarios.A]);
  const resultB = useMemo(() => simulateFire(scenarios.B), [scenarios.B]);
  const activeResult = activeScenario === "A" ? resultA : resultB;

  useEffect(() => {
    trackEvent("fire_result_view", {
      fire_age: activeResult.fireAge ?? undefined,
      years_to_fire: activeResult.yearsToFire ?? undefined,
    });
  }, [activeResult.fireAge, activeResult.yearsToFire]);
  const currencySymbol = currencySymbolFor(currency);

  function update<K extends keyof FireInputs>(key: K, value: FireInputs[K]) {
    setScenarios((prev) => ({
      ...prev,
      [activeScenario]: { ...prev[activeScenario], [key]: value },
    }));
    trackEvent("slider_adjust", { param_name: key, value });
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{t("title")}</h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">{t("subtitle")}</p>
        </div>
        <ThemeToggle />
      </header>

      <AdSlot variant="display" label={t("adDisplay")} />

      <div className="mt-6 mb-6">
        <ScenarioTabs
          active={activeScenario}
          onChange={(s) => {
            setActiveScenario(s);
            trackEvent("scenario_compare_start", {});
          }}
          compareMode={compareMode}
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
          <CurrencySelector
            value={currency}
            onChange={(c) => {
              setCurrency(c);
              trackEvent("currency_change", { currency: c });
            }}
            label={t("currency")}
          />
          <Slider label={t("currentAge")} value={inputs.currentAge} min={18} max={80} onChange={(v) => update("currentAge", v)} />
          <Slider label={t("targetAge")} value={inputs.targetAge} min={inputs.currentAge + 1} max={90} onChange={(v) => update("targetAge", v)} />
          <Slider
            label={t("currentPortfolio")}
            value={inputs.currentPortfolio}
            min={0}
            max={2000000}
            step={1000}
            onChange={(v) => update("currentPortfolio", v)}
            formatValue={(v) => `${currencySymbol}${v.toLocaleString()}`}
          />
          <Slider
            label={t("monthlyContribution")}
            value={inputs.monthlyContribution}
            min={0}
            max={20000}
            step={50}
            onChange={(v) => update("monthlyContribution", v)}
            formatValue={(v) => `${currencySymbol}${v.toLocaleString()}`}
          />
          <Slider
            label={t("annualExpenses")}
            value={inputs.annualExpenses}
            min={5000}
            max={300000}
            step={500}
            onChange={(v) => update("annualExpenses", v)}
            formatValue={(v) => `${currencySymbol}${v.toLocaleString()}`}
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
              labels={{
                metric: t("metric"),
                scenarioA: t("scenarioA"),
                scenarioB: t("scenarioB"),
                fireNumber: t("fireNumber"),
                fireAge: t("fireAge"),
                yearsToFire: t("yearsToFire"),
                notReached: t("notReached"),
              }}
            />
          ) : (
            <ResultCards
              fireNumber={activeResult.fireNumber}
              fireAge={activeResult.fireAge}
              yearsToFire={activeResult.yearsToFire}
              currencySymbol={currencySymbol}
              isCoastFire={activeResult.isCoastFire}
              isLeanFire={activeResult.isLeanFire}
              labels={{
                fireNumber: t("fireNumber"),
                fireAge: t("fireAge"),
                yearsToFire: t("yearsToFire"),
                notReached: t("notReached"),
                coastFire: t("coastFire"),
                leanFire: t("leanFire"),
              }}
            />
          )}

          <FireChart datasets={chartDatasets} currencySymbol={currencySymbol} showLegend={compareMode} />

          <AdSlot variant="native" label={t("adNative")} />

          <AffiliateBanner
            title={t("affiliateTitle")}
            disclosureLabel={t("affiliateDisclosure")}
            partners={AFFILIATE_PARTNERS}
          />
        </section>
      </div>

      <AdSlot variant="display" label={t("adDisplay")} />

      <DisclaimerFooter text={t("disclaimer")} />
    </div>
  );
}
