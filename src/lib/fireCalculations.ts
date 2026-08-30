export type FireInputs = {
  currentAge: number;
  targetAge: number;
  currentPortfolio: number;
  monthlyContribution: number;
  annualExpenses: number;
  realReturnPct: number; // e.g. 6 for 6%
  withdrawalRatePct: number; // e.g. 4 for 4%
  effectiveTaxRatePct: number; // e.g. 15 for 15%
};

export type YearPoint = {
  age: number;
  balance: number;
  phase: "accumulation" | "withdrawal";
};

export type FireResult = {
  fireNumber: number;
  fireAge: number | null; // null if not reachable within a reasonable horizon
  yearsToFire: number | null;
  isCoastFire: boolean;
  isLeanFire: boolean;
  series: YearPoint[];
};

const MAX_HORIZON_YEARS = 60;
// Fallback Lean FIRE threshold when no currency-specific threshold is passed in
// (see src/lib/currencyRanges.ts, which the UI always supplies based on the
// selected currency — this constant only matters for callers that don't).
const LEAN_FIRE_EXPENSE_THRESHOLD = 25000;

/**
 * FIRE Number: annual expenses grossed up for the effective tax rate on withdrawals,
 * divided by the safe withdrawal rate.
 */
export function calcFireNumber(annualExpenses: number, withdrawalRatePct: number, effectiveTaxRatePct: number): number {
  const grossedUpExpenses = annualExpenses / (1 - effectiveTaxRatePct / 100);
  return grossedUpExpenses / (withdrawalRatePct / 100);
}

export function simulateFire(inputs: FireInputs, leanFireThreshold: number = LEAN_FIRE_EXPENSE_THRESHOLD): FireResult {
  const {
    currentAge,
    targetAge,
    currentPortfolio,
    monthlyContribution,
    annualExpenses,
    realReturnPct,
    withdrawalRatePct,
    effectiveTaxRatePct,
  } = inputs;

  const fireNumber = calcFireNumber(annualExpenses, withdrawalRatePct, effectiveTaxRatePct);
  const monthlyReturn = realReturnPct / 100 / 12;

  const series: YearPoint[] = [];
  let balance = currentPortfolio;
  let fireAge: number | null = null;

  const endAge = currentAge + MAX_HORIZON_YEARS;
  let age = currentAge;

  series.push({ age, balance, phase: "accumulation" });

  // Accumulation phase: simulate month by month, record yearly snapshots
  while (age < endAge) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyReturn) + monthlyContribution;
      if (fireAge === null && balance >= fireNumber) {
        fireAge = Math.round((age + (m + 1) / 12) * 10) / 10;
      }
    }
    age += 1;
    series.push({ age, balance, phase: "accumulation" });
    if (fireAge !== null) break;
  }

  const yearsToFire = fireAge !== null ? Math.max(0, Math.round((fireAge - currentAge) * 10) / 10) : null;

  // Withdrawal phase: continue simulation from the later of fireAge/targetAge to visualize drawdown
  const withdrawalStartAge = fireAge !== null ? Math.max(fireAge, targetAge) : targetAge;
  let withdrawalBalance = balance;
  const annualWithdrawal = annualExpenses / (1 - effectiveTaxRatePct / 100);

  let wAge = Math.ceil(withdrawalStartAge);
  const withdrawalEndAge = wAge + 40;
  while (wAge <= withdrawalEndAge && withdrawalBalance > 0) {
    withdrawalBalance = withdrawalBalance * (1 + realReturnPct / 100) - annualWithdrawal;
    wAge += 1;
    series.push({ age: wAge, balance: Math.max(0, withdrawalBalance), phase: "withdrawal" });
    if (withdrawalBalance <= 0) break;
  }

  // Coast FIRE: could current portfolio alone (no further contributions) reach fireNumber by targetAge?
  const yearsToTarget = Math.max(0, targetAge - currentAge);
  const coastProjection = currentPortfolio * Math.pow(1 + realReturnPct / 100, yearsToTarget);
  const isCoastFire = coastProjection >= fireNumber;

  const isLeanFire = annualExpenses <= leanFireThreshold;

  return { fireNumber, fireAge, yearsToFire, isCoastFire, isLeanFire, series };
}
