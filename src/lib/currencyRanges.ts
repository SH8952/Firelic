/**
 * Currency-appropriate slider ranges and defaults for the three inputs whose
 * realistic magnitude varies a lot by currency (portfolio size, monthly
 * contribution, annual expenses), plus the Lean FIRE expense threshold.
 *
 * These are rounded, sensible planning ranges — not live FX conversions.
 * A client-side-only educational simulator shouldn't depend on a live
 * exchange-rate feed (which would also drift out of date); USD/EUR/GBP
 * share similar nominal magnitudes, while KRW (~1,300x USD) and JPY
 * (~150x USD) are scaled up to realistic round numbers in that currency.
 */
export type CurrencyRangeField = {
  min: number;
  max: number;
  step: number;
  default: number;
};

export type CurrencyRangeConfig = {
  currentPortfolio: CurrencyRangeField;
  monthlyContribution: CurrencyRangeField;
  annualExpenses: CurrencyRangeField;
  leanFireThreshold: number;
};

const USD_LIKE: CurrencyRangeConfig = {
  currentPortfolio: { min: 0, max: 2000000, step: 1000, default: 50000 },
  monthlyContribution: { min: 0, max: 20000, step: 50, default: 1500 },
  annualExpenses: { min: 5000, max: 300000, step: 500, default: 40000 },
  leanFireThreshold: 25000,
};

export const CURRENCY_RANGES: Record<string, CurrencyRangeConfig> = {
  USD: USD_LIKE,
  EUR: USD_LIKE,
  GBP: USD_LIKE,
  KRW: {
    currentPortfolio: { min: 0, max: 3_000_000_000, step: 1_000_000, default: 65_000_000 },
    monthlyContribution: { min: 0, max: 30_000_000, step: 100_000, default: 2_000_000 },
    annualExpenses: { min: 5_000_000, max: 500_000_000, step: 1_000_000, default: 52_000_000 },
    leanFireThreshold: 32_000_000,
  },
  JPY: {
    currentPortfolio: { min: 0, max: 300_000_000, step: 100_000, default: 7_500_000 },
    monthlyContribution: { min: 0, max: 3_000_000, step: 10_000, default: 225_000 },
    annualExpenses: { min: 500_000, max: 50_000_000, step: 100_000, default: 6_000_000 },
    leanFireThreshold: 3_750_000,
  },
};

export function currencyRangeFor(code: string): CurrencyRangeConfig {
  return CURRENCY_RANGES[code] ?? USD_LIKE;
}
