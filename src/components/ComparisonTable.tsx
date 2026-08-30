"use client";

import type { FireResult } from "@/lib/fireCalculations";

type ComparisonTableProps = {
  resultA: FireResult;
  resultB: FireResult;
  currencySymbol: string;
  currencyUnit: string;
  labels: {
    metric: string;
    scenarioA: string;
    scenarioB: string;
    fireNumber: string;
    fireAge: string;
    yearsToFire: string;
    notReached: string;
    ageUnit: string;
    yearsUnit: string;
  };
};

/** Appends a unit word after a value, separated by a single space — and
 * omits the space entirely when the unit is empty. */
function withUnit(value: string | number, unit: string): string {
  return unit ? `${value} ${unit}` : String(value);
}

function fmt(v: number, symbol: string, unit: string) {
  return withUnit(`${symbol}${Math.round(v).toLocaleString()}`, unit);
}

export function ComparisonTable({ resultA, resultB, currencySymbol, currencyUnit, labels }: ComparisonTableProps) {
  const rows = [
    {
      label: labels.fireNumber,
      a: fmt(resultA.fireNumber, currencySymbol, currencyUnit),
      b: fmt(resultB.fireNumber, currencySymbol, currencyUnit),
    },
    {
      label: labels.fireAge,
      a: resultA.fireAge !== null ? withUnit(resultA.fireAge, labels.ageUnit) : labels.notReached,
      b: resultB.fireAge !== null ? withUnit(resultB.fireAge, labels.ageUnit) : labels.notReached,
    },
    {
      label: labels.yearsToFire,
      a: resultA.yearsToFire !== null ? withUnit(resultA.yearsToFire, labels.yearsUnit) : labels.notReached,
      b: resultB.yearsToFire !== null ? withUnit(resultB.yearsToFire, labels.yearsUnit) : labels.notReached,
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
            <th className="px-4 py-3 font-medium">{labels.metric}</th>
            <th className="px-4 py-3 font-medium">{labels.scenarioA}</th>
            <th className="px-4 py-3 font-medium">{labels.scenarioB}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-[var(--color-border)] last:border-0">
              <td className="px-4 py-3 text-[var(--color-text-secondary)]">{row.label}</td>
              <td className="tabular-nums px-4 py-3 font-semibold text-[var(--color-text-primary)]">{row.a}</td>
              <td className="tabular-nums px-4 py-3 font-semibold text-[var(--color-text-primary)]">{row.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
