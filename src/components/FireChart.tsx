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

type FireChartProps = {
  series: YearPoint[];
  currencySymbol: string;
  accumulationLabel: string;
  withdrawalLabel: string;
};

export function FireChart({ series, currencySymbol, accumulationLabel, withdrawalLabel }: FireChartProps) {
  const labels = series.map((p) => p.age);
  const accumulationData = series.map((p) => (p.phase === "accumulation" ? p.balance : null));
  const withdrawalData = series.map((p) => (p.phase === "withdrawal" ? p.balance : null));

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <Line
        data={{
          labels,
          datasets: [
            {
              label: accumulationLabel,
              data: accumulationData,
              borderColor: "var(--color-chart-accumulation)",
              backgroundColor: "color-mix(in srgb, var(--color-chart-accumulation) 20%, transparent)",
              fill: true,
              tension: 0.25,
              spanGaps: false,
              pointRadius: 0,
            },
            {
              label: withdrawalLabel,
              data: withdrawalData,
              borderColor: "var(--color-chart-withdrawal)",
              backgroundColor: "color-mix(in srgb, var(--color-chart-withdrawal) 20%, transparent)",
              fill: true,
              tension: 0.25,
              spanGaps: false,
              pointRadius: 0,
            },
          ],
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
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${currencySymbol}${Number(ctx.parsed.y).toLocaleString()}`,
              },
            },
          },
        }}
      />
    </div>
  );
}
