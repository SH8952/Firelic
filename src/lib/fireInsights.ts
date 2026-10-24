import { simulateFire, type FireInputs } from "@/lib/fireCalculations";

export type LeverKey = "saveMore" | "spendLess" | "returnUp";

export type LeverResult = {
  key: LeverKey;
  fireAge: number | null;
  /** Years sooner than the base case; null when it cannot be compared. */
  yearsSooner: number | null;
};

export type SensitivityGrid = {
  returns: number[];
  contributions: number[];
  /** cells[row][col] = FIRE age (null = not reached within the horizon). */
  cells: (number | null)[][];
  baseRow: number;
  baseCol: number;
};

const CONTRIBUTION_FACTORS = [0.5, 0.75, 1, 1.25, 1.5];
const RETURN_STEPS = [-2, -1, 0, 1, 2];

function ageFor(inputs: FireInputs, leanThreshold: number): number | null {
  return simulateFire(inputs, leanThreshold).fireAge;
}

export function buildLevers(inputs: FireInputs, leanThreshold: number): LeverResult[] {
  const baseAge = ageFor(inputs, leanThreshold);
  const variants: { key: LeverKey; inputs: FireInputs }[] = [
    { key: "saveMore", inputs: { ...inputs, monthlyContribution: inputs.monthlyContribution * 1.1 } },
    { key: "spendLess", inputs: { ...inputs, annualExpenses: inputs.annualExpenses * 0.9 } },
    { key: "returnUp", inputs: { ...inputs, realReturnPct: Math.min(15, inputs.realReturnPct + 1) } },
  ];
  return variants.map(({ key, inputs: v }) => {
    const age = ageFor(v, leanThreshold);
    const yearsSooner =
      baseAge !== null && age !== null ? Math.max(0, Math.round((baseAge - age) * 10) / 10) : null;
    return { key, fireAge: age, yearsSooner };
  });
}

export function buildSensitivity(inputs: FireInputs, leanThreshold: number): SensitivityGrid {
  const returns = Array.from(
    new Set(
      RETURN_STEPS.map((s) => Math.round(Math.min(15, Math.max(0, inputs.realReturnPct + s)) * 10) / 10),
    ),
  ).sort((a, b) => a - b);
  const contributions = Array.from(
    new Set(CONTRIBUTION_FACTORS.map((f) => Math.round(inputs.monthlyContribution * f))),
  ).sort((a, b) => a - b);

  const cells = returns.map((r) =>
    contributions.map((c) => ageFor({ ...inputs, realReturnPct: r, monthlyContribution: c }, leanThreshold)),
  );
  const baseReturn = Math.round(inputs.realReturnPct * 10) / 10;
  return {
    returns,
    contributions,
    cells,
    baseRow: returns.indexOf(baseReturn),
    baseCol: contributions.indexOf(Math.round(inputs.monthlyContribution)),
  };
}
