"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { YearPoint } from "@/lib/fireCalculations";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export type ChartDataset = {
  label: string;
  series: YearPoint[];
  color: string;
  dashed?: boolean;
};

type FireChartProps = {
  datasets: ChartDataset[];
  currencySymbol: string;
  showLegend?: boolean;
};

export function FireChart({ datasets, currencySymbol, showLegend = false }: FireChartProps) {
  // Union of all ages across datasets, sorted, used as shared x-axis labels.
  const allAges = Array.from(
    new Set(datasets.flatMap((d) => d.series.map((p) => p.age)))
  ).sort((a, b) => a - b);

  const balanceByAge = (series: YearPoint[]) => {
    const map = new Map(series.map((p) => [p.age, p.balance] as const));
    return allAges.map((age) => (map.has(age) ? map.get(age)! : null));
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <Line
        data={{
          labels: allAges,
          datasets: datasets.map((d) => ({
            label: d.label,
            data: balanceByAge(d.series),
            borderColor: d.color,
            backgroundColor: `color-mix(in srgb, ${d.color} 20%, transparent)`,
            borderDash: d.dashed ? [6, 4] : undefined,
            fill: !d.dashed,
            tension: 0.25,
            spanGaps: false,
            pointRadius: 0,
          })),
        }}
        options={{
          responsive: true,
          animation: { duration: 200 },
          interaction: { mode: "index", intersect: false },
          scales: {
            x: { title: { display: true, text: "Age" } },
            y: {
              ticks: {
                callback: (val) => `${currencySymbol}${Number(val).toLocaleString()}`,
              },
            },
          },
          plugins: {
            legend: { display: showLegend },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  `${ctx.dataset.label}: ${currencySymbol}${Number(ctx.parsed.y).toLocaleString()}`,
              },
            },
          },
        }}
      />
    </div>
  );
}
