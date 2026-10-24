export const REFERENCE_TABLES = ["fire-number-by-spending", "years-to-fire-by-savings-rate"] as const;
export type ReferenceTable = (typeof REFERENCE_TABLES)[number];

export function isReferenceTable(v: string): v is ReferenceTable {
  return (REFERENCE_TABLES as readonly string[]).includes(v);
}

/** i18n key for each table. */
export const TABLE_KEY: Record<ReferenceTable, "spending" | "savings"> = {
  "fire-number-by-spending": "spending",
  "years-to-fire-by-savings-rate": "savings",
};

type Money = { code: string; monthly: number[] };

const BASE = [1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 8000, 10000];

/** Currency and monthly spending rows shown for each locale. */
export const LOCALE_MONEY: Record<string, Money> = {
  en: { code: "USD", monthly: BASE },
  es: { code: "EUR", monthly: BASE },
  ko: { code: "KRW", monthly: BASE.map((v) => v * 1000) },
  ja: { code: "JPY", monthly: BASE.map((v) => v * 100) },
};

export const WITHDRAWAL_RATES = [3, 3.5, 4, 4.5];
export const SAVINGS_RATES = [10, 15, 20, 25, 30, 40, 50, 60, 70];
export const REAL_RETURNS = [3, 4, 5, 6, 7];
export const SAVINGS_TABLE_SWR = 4;

/** FIRE number = annual spending ÷ withdrawal rate. */
export function fireNumber(monthlySpending: number, swrPct: number): number {
  return (monthlySpending * 12) / (swrPct / 100);
}

/**
 * Years to FIRE starting from zero savings, saving a fixed share of income
 * each year: n = ln(1 + (1-s)·r / (s·swr)) / ln(1+r).
 */
export function yearsToFire(savingsRatePct: number, realReturnPct: number, swrPct: number): number {
  const s = savingsRatePct / 100;
  const r = realReturnPct / 100;
  const w = swrPct / 100;
  return Math.log(1 + ((1 - s) * r) / (s * w)) / Math.log(1 + r);
}

function trim(n: number, digits: number): string {
  return String(Number(n.toFixed(digits)));
}

/** Locale-aware money text; ko/ja use 만/억 (万/億) units. */
export function formatMoney(value: number, locale: string, code: string): string {
  if (locale === "ko") {
    if (value >= 1e8) return `${trim(value / 1e8, 2)}억 원`;
    return `${trim(value / 1e4, 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}만 원`;
  }
  if (locale === "ja") {
    if (value >= 1e8) return `${trim(value / 1e8, 2)}億円`;
    return `${trim(value / 1e4, 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}万円`;
  }
  return new Intl.NumberFormat(locale, { style: "currency", currency: code, maximumFractionDigits: 0 }).format(value);
}
