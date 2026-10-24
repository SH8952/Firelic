import { calcFireNumber } from "@/lib/fireCalculations";
import { currencyRangeFor, type CurrencyRangeField } from "@/lib/currencyRanges";

/**
 * FIRE 유형(Barista / Coast / Lean / Fat)별 전용 계산기 페이지의 계산·프리셋 로직.
 * 기존 simulateFire/calcFireNumber를 그대로 재사용하고, 유형 고유 계산(Coast 기준 금액 등)만 여기서 다룬다.
 */
export const FIRE_TYPES = ["barista-fire", "coast-fire", "lean-fire", "fat-fire"] as const;
export type FireType = (typeof FIRE_TYPES)[number];

export function isFireType(value: string): value is FireType {
  return (FIRE_TYPES as readonly string[]).includes(value);
}

export type TypeInputs = {
  currentAge: number;
  retirementAge: number; // Coast FIRE only
  currentPortfolio: number;
  monthlyContribution: number;
  annualExpenses: number;
  partTimeIncome: number; // Barista FIRE only (annual, after tax)
  realReturnPct: number;
  withdrawalRatePct: number;
  effectiveTaxRatePct: number;
};

function snap(value: number, field: CurrencyRangeField): number {
  const stepped = Math.round(value / field.step) * field.step;
  return Math.min(field.max, Math.max(field.min, stepped));
}

/** 통화별 슬라이더 범위의 기본값을 배수로 환산해 유형별 시작값을 만든다(환율 변환 아님). */
export function presetFor(type: FireType, currency: string, keepAges?: { currentAge: number; retirementAge: number }): TypeInputs {
  const r = currencyRangeFor(currency);
  const base: TypeInputs = {
    currentAge: keepAges?.currentAge ?? 30,
    retirementAge: keepAges?.retirementAge ?? 65,
    currentPortfolio: r.currentPortfolio.default,
    monthlyContribution: r.monthlyContribution.default,
    annualExpenses: r.annualExpenses.default,
    partTimeIncome: snap(r.annualExpenses.default * 0.375, r.annualExpenses),
    realReturnPct: 6,
    withdrawalRatePct: 4,
    effectiveTaxRatePct: 15,
  };
  if (type === "lean-fire") {
    return { ...base, annualExpenses: r.leanFireThreshold, monthlyContribution: snap(r.monthlyContribution.default * 0.8, r.monthlyContribution) };
  }
  if (type === "fat-fire") {
    return {
      ...base,
      annualExpenses: snap(fatFireThreshold(currency), r.annualExpenses),
      currentPortfolio: snap(r.currentPortfolio.default * 4, r.currentPortfolio),
      monthlyContribution: snap(r.monthlyContribution.default * 4, r.monthlyContribution),
    };
  }
  return base;
}

/** Fat FIRE 기준선: 통화별 기본 지출의 2.5배(USD 기준 약 10만). 정의는 출처마다 다르므로 "일반적으로 언급되는 범위"로만 안내한다. */
export function fatFireThreshold(currency: string): number {
  return currencyRangeFor(currency).annualExpenses.default * 2.5;
}

export type CoastResult = {
  fireNumber: number;
  coastNumber: number;
  progressPct: number;
  reached: boolean;
  /** Coast 기준을 처음 넘는 나이(이미 넘었으면 현재 나이, 은퇴 나이까지 못 넘으면 null) */
  coastAge: number | null;
  projectedAtRetirement: number;
  series: { age: number; balance: number }[];
  threshold: { age: number; balance: number }[];
};

/** Coast FIRE: 지금 자산이 추가 저축 없이 은퇴 나이까지 불어 FIRE 금액에 닿으려면 필요한 금액. */
export function computeCoast(i: TypeInputs): CoastResult {
  const years = Math.max(1, i.retirementAge - i.currentAge);
  const g = 1 + i.realReturnPct / 100;
  const fireNumber = calcFireNumber(i.annualExpenses, i.withdrawalRatePct, i.effectiveTaxRatePct);
  const needAt = (t: number) => fireNumber / Math.pow(g, years - t);
  const coastNumber = needAt(0);
  const projectedAtRetirement = i.currentPortfolio * Math.pow(g, years);
  const monthly = Math.pow(g, 1 / 12) - 1;

  const series = [{ age: i.currentAge, balance: i.currentPortfolio }];
  const threshold = [{ age: i.currentAge, balance: coastNumber }];
  let balance = i.currentPortfolio;
  let coastAge: number | null = i.currentPortfolio >= coastNumber ? i.currentAge : null;
  for (let m = 1; m <= years * 12; m++) {
    balance = balance * (1 + monthly) + i.monthlyContribution;
    const t = m / 12;
    if (coastAge === null && balance >= needAt(t)) coastAge = Math.round((i.currentAge + t) * 10) / 10;
    if (m % 12 === 0) {
      series.push({ age: i.currentAge + t, balance });
      threshold.push({ age: i.currentAge + t, balance: needAt(t) });
    }
  }
  return {
    fireNumber,
    coastNumber,
    progressPct: coastNumber > 0 ? (i.currentPortfolio / coastNumber) * 100 : 0,
    reached: i.currentPortfolio >= coastNumber,
    coastAge,
    projectedAtRetirement,
    series,
    threshold,
  };
}
