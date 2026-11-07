"use client";

import * as React from "react";
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
  /** 실제 색 값(#rrggbb 등) 또는 `var(--color-...)` 형태. var(...) 는 아래 팔레트로 풀어 쓴다. */
  color: string;
  dashed?: boolean;
};

type FireChartProps = {
  datasets: ChartDataset[];
  currencySymbol: string;
  showLegend?: boolean;
};

/**
 * Chart.js 는 <canvas> 에 그리기 때문에 CSS 변수(`var(--...)`)를 해석하지 못한다.
 * (2026-11-07 이전에는 변수 문자열이 그대로 전달돼 선·면이 검정으로 그려지고, 축 글자·격자는
 * 라이브러리 기본 회색이라 다크 모드와 어긋났다.) 그래서 <html> 에 적용된 토큰 값을 읽어
 * 실제 색으로 바꿔 넘기고, 모드가 바뀌면(html 의 class 변화) 다시 읽어 그래프를 갱신한다.
 */
const PALETTE_VARS = [
  "--color-chart-accumulation",
  "--color-chart-withdrawal",
  "--color-text-primary",
  "--color-text-secondary",
  "--color-border",
  "--color-surface",
] as const;

type PaletteKey = (typeof PALETTE_VARS)[number];
type Palette = Record<PaletteKey, string>;

// 서버 렌더·토큰을 못 읽을 때 쓰는 라이트 모드 기본값(globals.css 의 :root 와 같은 값).
const FALLBACK_PALETTE: Palette = {
  "--color-chart-accumulation": "#047857",
  "--color-chart-withdrawal": "#2563EB",
  "--color-text-primary": "#111827",
  "--color-text-secondary": "#5B6573",
  "--color-border": "#E3E7EC",
  "--color-surface": "#FFFFFF",
};

function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  const out = { ...FALLBACK_PALETTE };
  for (const name of PALETTE_VARS) {
    const v = cs.getPropertyValue(name).trim();
    if (v) out[name] = v;
  }
  return out;
}

function subscribeToThemeChange(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "style", "data-theme"],
  });
  return () => observer.disconnect();
}

/** 현재 모드의 팔레트. useSyncExternalStore 가 문자열 비교로 변화를 감지하므로 JSON 문자열을 스냅샷으로 쓴다. */
function useChartPalette(): Palette {
  const snapshot = React.useSyncExternalStore(
    subscribeToThemeChange,
    () => JSON.stringify(readPalette()),
    () => JSON.stringify(FALLBACK_PALETTE),
  );
  return React.useMemo(() => JSON.parse(snapshot) as Palette, [snapshot]);
}

/** `var(--color-x)` 를 팔레트 값으로, 그 외 문자열은 그대로 돌려준다. */
function resolveColor(color: string, palette: Palette): string {
  const m = /^var\(\s*(--[a-z0-9-]+)\s*(?:,[^)]*)?\)$/i.exec(color.trim());
  if (!m) return color;
  return palette[m[1] as PaletteKey] ?? color;
}

/** #rrggbb → rgba(r,g,b,alpha). 해석할 수 없으면 원래 색을 그대로 쓴다(면 채우기용). */
function withAlpha(color: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return color;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function FireChart({ datasets, currencySymbol, showLegend = false }: FireChartProps) {
  const palette = useChartPalette();

  // Union of all ages across datasets, sorted, used as shared x-axis labels.
  const allAges = Array.from(
    new Set(datasets.flatMap((d) => d.series.map((p) => p.age)))
  ).sort((a, b) => a - b);

  const balanceByAge = (series: YearPoint[]) => {
    const map = new Map(series.map((p) => [p.age, p.balance] as const));
    return allAges.map((age) => (map.has(age) ? map.get(age)! : null));
  };

  const textColor = palette["--color-text-secondary"];
  const gridColor = palette["--color-border"];

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <Line
        data={{
          labels: allAges,
          datasets: datasets.map((d) => {
            const line = resolveColor(d.color, palette);
            return {
              label: d.label,
              data: balanceByAge(d.series),
              borderColor: line,
              backgroundColor: withAlpha(line, 0.16),
              borderWidth: 2,
              borderDash: d.dashed ? [6, 4] : undefined,
              fill: !d.dashed,
              tension: 0.25,
              spanGaps: false,
              pointRadius: 0,
            };
          }),
        }}
        options={{
          responsive: true,
          animation: { duration: 200 },
          interaction: { mode: "index", intersect: false },
          scales: {
            x: {
              title: { display: true, text: "Age", color: textColor },
              ticks: { color: textColor },
              grid: { color: gridColor },
              border: { color: gridColor },
            },
            y: {
              ticks: {
                color: textColor,
                callback: (val) => `${currencySymbol}${Number(val).toLocaleString()}`,
              },
              grid: { color: gridColor },
              border: { color: gridColor },
            },
          },
          plugins: {
            legend: { display: showLegend, labels: { color: textColor } },
            tooltip: {
              backgroundColor: palette["--color-surface"],
              titleColor: palette["--color-text-primary"],
              bodyColor: palette["--color-text-primary"],
              borderColor: gridColor,
              borderWidth: 1,
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
