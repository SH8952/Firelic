"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/Slider";
import { ResultCards } from "@/components/ResultCards";
import { FireChart } from "@/components/FireChart";
import { CurrencySelector, currencySymbolFor } from "@/components/CurrencySelector";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { simulateFire, type FireInputs } from "@/lib/fireCalculations";

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

export function FireCalculator() {
  const t = useTranslations("calculator");
  const [inputs, setInputs] = useState<FireInputs>(DEFAULT_INPUTS);
  const [currency, setCurrency] = useState("USD");

  const result = useMemo(() => simulateFire(inputs), [inputs]);
  const currencySymbol = currencySymbolFor(currency);

  function update<K extends keyof FireInputs>(key: K, value: FireInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{t("title")}</h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">{t("subtitle")}</p>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
        <section className="flex flex-col gap-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:sticky lg:top-6 lg:h-fit">
          <CurrencySelector value={currency} onChange={setCurrency} label={t("currency")} />
          <Slider
            label={t("currentAge")}
            value={inputs.currentAge}
            min={18}
            max={80}
            onChange={(v) => update("currentAge", v)}
          />
          <Slider
            label={t("targetAge")}
            value={inputs.targetAge}
            min={inputs.currentAge + 1}
            max={90}
            onChange={(v) => update("targetAge", v)}
          />
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
          <Slider
            label={t("realReturn")}
            value={inputs.realReturnPct}
            min={0}
            max={15}
            step={0.1}
            suffix="%"
            onChange={(v) => update("realReturnPct", v)}
          />
          <Slider
            label={t("withdrawalRate")}
            value={inputs.withdrawalRatePct}
            min={2}
            max={6}
            step={0.1}
            suffix="%"
            onChange={(v) => update("withdrawalRatePct", v)}
          />
          <Slider
            label={t("effectiveTaxRate")}
            value={inputs.effectiveTaxRatePct}
            min={0}
            max={40}
            step={1}
            suffix="%"
            onChange={(v) => update("effectiveTaxRatePct", v)}
          />
        </section>

        <section className="flex flex-col gap-6">
          <ResultCards
            fireNumber={result.fireNumber}
            fireAge={result.fireAge}
            yearsToFire={result.yearsToFire}
            currencySymbol={currencySymbol}
            isCoastFire={result.isCoastFire}
            isLeanFire={result.isLeanFire}
            labels={{
              fireNumber: t("fireNumber"),
              fireAge: t("fireAge"),
              yearsToFire: t("yearsToFire"),
              notReached: t("notReached"),
              coastFire: t("coastFire"),
              leanFire: t("leanFire"),
            }}
          />
          <FireChart
            series={result.series}
            currencySymbol={currencySymbol}
            accumulationLabel={t("accumulationPhase")}
            withdrawalLabel={t("withdrawalPhase")}
          />
        </section>
      </div>

      <DisclaimerFooter text={t("disclaimer")} />
    </div>
  );
}
