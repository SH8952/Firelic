"use client";

import { useState } from "react";
import { NumField } from "./NumField";
import { calcSeverance, fmtWon, futureValue } from "@/lib/tools";

export function SeveranceTool() {
  const [join, setJoin] = useState("2020-03-02");
  const [last, setLast] = useState("2026-12-31");
  const [wage3m, setWage3m] = useState(9000000);
  const [bonus, setBonus] = useState(0);
  const [leave, setLeave] = useState(0);
  const [rate, setRate] = useState(4);
  const [spendPct, setSpendPct] = useState(0);

  const r = calcSeverance({ joinYmd: join, lastYmd: last, wage3m, annualBonus: bonus, annualLeavePay: leave });
  const keep = r.ok ? r.severance * (1 - spendPct / 100) : 0;
  const keepMan = keep / 10000;
  const after25 = futureValue(keepMan, 0, 25, rate);

  const dateCls =
    "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none";

  return (
    <div className="flex flex-col gap-8">
      <ol className="flex flex-col gap-6">
        <li className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm font-semibold text-[var(--color-primary)]">1단계 · 근무 기간</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-[var(--color-text-primary)]">
              입사일
              <input type="date" value={join} onChange={(e) => setJoin(e.target.value)} className={dateCls} />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-[var(--color-text-primary)]">
              마지막 근무일
              <input type="date" value={last} onChange={(e) => setLast(e.target.value)} className={dateCls} />
            </label>
          </div>
        </li>
        <li className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm font-semibold text-[var(--color-primary)]">2단계 · 임금(세전, 원)</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <NumField label="최근 3개월 임금 총액" unit="원" value={wage3m} onChange={setWage3m} hint="기본급+수당 합계, 세전" />
            <NumField label="최근 1년 상여금" unit="원" value={bonus} onChange={setBonus} hint="없으면 0" />
            <NumField label="최근 1년 연차수당" unit="원" value={leave} onChange={setLeave} hint="없으면 0" />
          </div>
        </li>
      </ol>

      <section className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)]/5 p-5">
        <p className="text-sm font-semibold text-[var(--color-primary)]">3단계 · 계산 결과</p>
        {!r.ok ? (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{r.reason}</p>
        ) : (
          <>
            <p className="mt-2 text-3xl font-bold text-[var(--color-text-primary)]">{fmtWon(r.severance)}</p>
            {!r.eligible ? (
              <p className="mt-2 text-sm font-semibold text-[var(--color-danger)]">
                계속 근로 기간이 {r.serviceDays}일로 1년(365일) 미만이라 법정 퇴직금 대상이 아닙니다. 아래 금액은 참고용 환산값입니다.
              </p>
            ) : null}
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between gap-3"><dt className="text-[var(--color-text-secondary)]">계속 근로 일수</dt><dd className="text-[var(--color-text-primary)]">{r.serviceDays.toLocaleString("en-US")}일</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[var(--color-text-secondary)]">직전 3개월 일수</dt><dd className="text-[var(--color-text-primary)]">{r.days3m}일</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[var(--color-text-secondary)]">상여금 가산(3/12)</dt><dd className="text-[var(--color-text-primary)]">{fmtWon(r.bonusAdd)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[var(--color-text-secondary)]">연차수당 가산(3/12)</dt><dd className="text-[var(--color-text-primary)]">{fmtWon(r.leaveAdd)}</dd></div>
              <div className="flex justify-between gap-3 sm:col-span-2"><dt className="text-[var(--color-text-secondary)]">1일 평균임금</dt><dd className="font-semibold text-[var(--color-text-primary)]">{fmtWon(r.avgDaily)}</dd></div>
            </dl>
          </>
        )}
      </section>

      {r.ok ? (
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">받은 퇴직금, 쓰면 vs 25년 묵히면</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <NumField label="당장 쓰는 비율" unit="%" value={spendPct} onChange={setSpendPct} max={100} />
            <NumField label="IRP 연 수익률 가정" unit="%" value={rate} onChange={setRate} max={15} />
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-primary)]">
            {fmtWon(r.severance)}의 {spendPct}%를 쓰고 나머지 {fmtWon(keep)}을 IRP에 25년 두면, 연 {rate}% 가정에서 약{" "}
            <strong>{fmtWon(after25 * 10000)}</strong>이 됩니다. 세금은 반영하지 않은 단순 계산입니다.
          </p>
        </section>
      ) : null}
    </div>
  );
}
