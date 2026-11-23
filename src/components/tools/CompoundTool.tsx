"use client";

import { useState } from "react";
import { NumField } from "./NumField";
import { compoundSchedule, crossoverYear, doublingYears, fmtMan } from "@/lib/tools";

function Chart({ rows }: { rows: ReturnType<typeof compoundSchedule> }) {
  const W = 640;
  const H = 240;
  const pad = { l: 8, r: 8, t: 10, b: 22 };
  const n = rows.length;
  const max = Math.max(...rows.map((r) => r.total), 1);
  const x = (i: number) => pad.l + (n === 1 ? 0 : (i / (n - 1)) * (W - pad.l - pad.r));
  const y = (v: number) => H - pad.b - (v / max) * (H - pad.t - pad.b);
  const path = (get: (r: (typeof rows)[number]) => number, base: (r: (typeof rows)[number]) => number) => {
    const top = rows.map((r, i) => `${x(i)},${y(get(r))}`).join(" L");
    const bottom = [...rows].reverse().map((r, i) => `${x(n - 1 - i)},${y(base(r))}`).join(" L");
    return `M${top} L${bottom} Z`;
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="원금, 누적 적립, 수익이 쌓이는 모습" className="h-auto w-full">
      <path d={path((r) => r.principal + r.contributed, () => 0)} fill="var(--color-border)" />
      <path d={path((r) => r.total, (r) => r.principal + r.contributed)} fill="var(--color-primary)" opacity="0.85" />
      <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="var(--color-border)" />
      <text x={pad.l} y={H - 6} fontSize="11" fill="var(--color-text-secondary)">1년</text>
      <text x={W - pad.r} y={H - 6} fontSize="11" textAnchor="end" fill="var(--color-text-secondary)">{n}년</text>
    </svg>
  );
}

export function CompoundTool() {
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(50);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(30);

  const y = Math.max(1, Math.min(60, Math.round(years)));
  const rows = compoundSchedule(initial, monthly, y, rate);
  const last = rows[rows.length - 1];
  const cross = crossoverYear(rows);
  const dbl = doublingYears(rate);
  const paid = last.principal + last.contributed;
  const interestShare = last.total > 0 ? Math.round((last.interest / last.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NumField label="처음 넣는 돈" unit="만원" value={initial} onChange={setInitial} />
        <NumField label="매달 넣는 돈" unit="만원" value={monthly} onChange={setMonthly} />
        <NumField label="연 수익률" unit="%" value={rate} onChange={setRate} max={30} />
        <NumField label="기간" unit="년" value={years} onChange={setYears} min={1} max={60} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-secondary)]">{y}년 뒤 총액</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">{fmtMan(last.total)}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-secondary)]">내가 넣은 돈</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">{fmtMan(paid)}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)]/5 p-4">
          <p className="text-xs text-[var(--color-primary)]">불어난 수익 ({interestShare}%)</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">{fmtMan(Math.max(0, last.interest))}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <Chart rows={rows} />
        <p className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--color-text-secondary)]">
          <span><span className="mr-1 inline-block h-2 w-3 bg-[var(--color-border)]" />원금 + 적립</span>
          <span><span className="mr-1 inline-block h-2 w-3 bg-[var(--color-primary)]" />수익</span>
        </p>
      </div>

      <p className="text-sm leading-7 text-[var(--color-text-primary)]">
        {cross
          ? `${cross}년차에 수익이 넣은 돈 전체를 처음 넘어섭니다. 그 뒤로는 일해서 넣는 돈보다 불어나는 돈이 더 큰 구간입니다.`
          : "이 조건에서는 기간 안에 수익이 넣은 돈을 넘지 못합니다. 기간을 늘리거나 수익률 가정을 확인해 보세요."}
        {dbl
          ? ` 연 ${rate}%라면 72법칙으로는 약 ${dbl.rule72.toFixed(1)}년, 정확히 계산하면 ${dbl.exact.toFixed(1)}년마다 원금이 두 배가 됩니다.`
          : ""}
      </p>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-[var(--color-surface)] text-xs text-[var(--color-text-secondary)]">
            <tr>
              <th className="px-3 py-2 text-left font-normal">연차</th>
              <th className="px-3 py-2 text-right font-normal">넣은 돈</th>
              <th className="px-3 py-2 text-right font-normal">수익</th>
              <th className="px-3 py-2 text-right font-normal">총액</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year} className={`border-t border-[var(--color-border)] ${r.year === cross ? "bg-[var(--color-accent)]/20 font-semibold" : ""}`}>
                <td className="px-3 py-2 text-[var(--color-text-primary)]">{r.year}년{r.year === cross ? " ★" : ""}</td>
                <td className="px-3 py-2 text-right text-[var(--color-text-secondary)]">{Math.round(r.principal + r.contributed).toLocaleString("en-US")}</td>
                <td className="px-3 py-2 text-right text-[var(--color-text-secondary)]">{Math.round(r.interest).toLocaleString("en-US")}</td>
                <td className="px-3 py-2 text-right text-[var(--color-text-primary)]">{Math.round(r.total).toLocaleString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="-mt-6 text-xs text-[var(--color-text-secondary)]">단위: 만원. ★는 수익이 넣은 돈을 처음 넘은 해입니다.</p>
    </div>
  );
}
