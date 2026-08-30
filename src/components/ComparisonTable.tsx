"use client";

import type { FireResult } from "@/lib/fireCalculations";

type ComparisonTableProps = {
  resultA: FireResult;
  resultB: FireResult;
  currencySymbol: string;
  labels: {
    metric: string;
    scenarioA: string;
    scenarioB: string;
    fireNumber: string;
    fireAge: string;
    yearsToFire: string;
    notReached: string;
  };
};

function fmt(v: number, symbol: string) {
  return `${symbol}${Math.round(v).toLocaleString()}`;
}

export function ComparisonTable({ resultA, resultB, currencySymbol, labels }: ComparisonTableProps) {
  const rows = [
    {
      label: labels.fireNumber,
      a: fmt(resultA.fireNumber, currencySymbol),
      b: fmt(resultB.fireNumber, currencySymbol),
    },
    {
      label: labels.fireAge,
      a: resultA.fireAge !== null ? String(resultA.fireAge) : labels.notReached,
      b: resultB.fireAge !== null ? String(resultB.fireAge) : labels.notReached,
    },
    {
      label: labels.yearsToFire,
      a: resultA.yearsToFire !== null ? String(resultA.yearsToFire) : labels.notReached,
      b: resultB.yearsToFire !== null ? String(resultB.yearsToFire) : labels.notReached,
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
