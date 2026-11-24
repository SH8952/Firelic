"use client";

import { useEffect, useState } from "react";
import { readSharedParams, parseBoundedNumber } from "@/lib/shared-params";
import { NumField } from "./NumField";
import { fmtMan, futureValue, requiredMonthly } from "@/lib/tools";

const RATES = [0, 3, 5, 7];

export function SavingGoalTool() {
  const [target, setTarget] = useState(10000);
  const [years, setYears] = useState(10);
  const [current, setCurrent] = useState(1000);
  const [rate, setRate] = useState(5);
  const [income, setIncome] = useState(350);

  // 글 속 사례 링크(?t=10000&y=10&c=1000&r=5&inc=350)로 열면 입력값을 채운다.
  useEffect(() => {
    const p = readSharedParams();
    if (!p) return;
    const t = parseBoundedNumber(p.get("t"), 1, 10_000_000);
    const y = parseBoundedNumber(p.get("y"), 1, 50);
    const c = parseBoundedNumber(p.get("c"), 0, 10_000_000);
    const r = parseBoundedNumber(p.get("r"), 0, 20);
    const inc = parseBoundedNumber(p.get("inc"), 0, 100_000);
    /* eslint-disable react-hooks/set-state-in-effect */
    if (t !== null) setTarget(t);
    if (y !== null) setYears(y);
    if (c !== null) setCurrent(c);
    if (r !== null) setRate(r);
    if (inc !== null) setIncome(inc);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const y = Math.max(1, Math.min(50, Math.round(years)));
  const need = requiredMonthly(target, current, y, rate);
  const deposits = need * y * 12;
  const grownCurrent = futureValue(current, 0, y, rate);
  const gainOnTotal = target - current - deposits;
  const share = income > 0 ? (need / income) * 100 : null;
  const yearOptions = Array.from(new Set([y - 2, y - 1, y, y + 1, y + 2].filter((v) => v >= 1 && v <= 50)));

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:grid-cols-2 lg:grid-cols-5">
        <NumField label="목표 금액" unit="만원" value={target} onChange={setTarget} min={1} />
        <NumField label="기간" unit="년" value={years} onChange={setYears} min={1} max={50} />
        <NumField label="지금 가진 돈" unit="만원" value={current} onChange={setCurrent} />
        <NumField label="연 수익률" unit="%" value={rate} onChange={setRate} min={0} max={20} />
        <NumField label="월 실수령(선택)" unit="만원" value={income} onChange={setIncome} hint="넣으면 소득 대비 비율을 보여 줍니다" />
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)]/5 p-5">
          <p className="text-xs font-semibold text-[var(--color-primary)]">필요한 월 저축액</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-text-primary)]">{need === 0 ? "0원" : fmtMan(need)}</p>
          {need === 0 ? (
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              지금 가진 돈만으로도 {y}년 뒤 목표({fmtMan(target)})를 넘습니다. 가진 돈은 {fmtMan(grownCurrent)}까지 불어납니다.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-1 text-sm text-[var(--color-text-secondary)]">
              <li>내가 넣는 돈 총 {fmtMan(deposits)} ({y}년 × 12개월)</li>
              <li>지금 가진 돈 {fmtMan(current)}</li>
              <li>수익이 채워 주는 몫 약 {fmtMan(Math.max(0, gainOnTotal))}</li>
              {share !== null ? (
                <li className={share > 50 ? "font-semibold text-[var(--color-danger)]" : ""}>
                  월 실수령의 약 {share.toFixed(1)}%{share > 50 ? " — 기간이나 목표를 조정해 보세요" : ""}
                </li>
              ) : null}
            </ul>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">기간과 수익률을 바꾸면 월 저축액은?</p>
          <table className="mt-3 w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="text-xs text-[var(--color-text-secondary)]">
                <th className="py-1 pr-2 text-left font-normal">기간 \ 수익률</th>
                {RATES.map((r) => (
                  <th key={r} className="px-2 py-1 text-right font-normal">
                    {r}%
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {yearOptions.map((yy) => (
                <tr key={yy} className="border-t border-[var(--color-border)]">
                  <th className={`py-2 pr-2 text-left font-medium ${yy === y ? "text-[var(--color-primary)]" : "text-[var(--color-text-primary)]"}`}>
                    {yy}년
                  </th>
                  {RATES.map((r) => {
                    const v = requiredMonthly(target, current, yy, r);
                    const hl = yy === y && r === Math.round(rate) && RATES.includes(Math.round(rate));
                    return (
                      <td key={r} className={`px-2 py-2 text-right ${hl ? "rounded bg-[var(--color-accent)]/25 font-semibold" : ""} text-[var(--color-text-primary)]`}>
                        {v === 0 ? "0" : Math.round(v).toLocaleString("en-US")}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">단위: 만원. 월 단위 복리, 월말 납입 가정.</p>
        </div>
      </section>
    </div>
  );
}
