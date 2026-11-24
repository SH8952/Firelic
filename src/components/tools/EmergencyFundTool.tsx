"use client";

import { useEffect, useState } from "react";
import { readSharedParams, parseBoundedNumber, parseStringChoice } from "@/lib/shared-params";
import { NumField } from "./NumField";
import {
  EMERGENCY_PROFILES,
  EMERGENCY_RISKS,
  calcEmergency,
  fmtMan,
  type EmergencyProfileKey,
} from "@/lib/tools";

const PROFILE_KEYS = Object.keys(EMERGENCY_PROFILES) as EmergencyProfileKey[];

export function EmergencyFundTool() {
  const [profile, setProfile] = useState<EmergencyProfileKey>("salaried");
  const [risks, setRisks] = useState<boolean[]>(EMERGENCY_RISKS.map(() => false));
  const [essential, setEssential] = useState(200);
  const [current, setCurrent] = useState(100);
  const [monthly, setMonthly] = useState(30);

  // 글 속 사례 링크(?pf=salaried&es=200&cu=100&ms=30&rk=1010)로 열면 입력값을 채운다.
  useEffect(() => {
    const p = readSharedParams();
    if (!p) return;
    const pf = parseStringChoice(p.get("pf"), PROFILE_KEYS);
    const es = parseBoundedNumber(p.get("es"), 0, 100_000);
    const cu = parseBoundedNumber(p.get("cu"), 0, 10_000_000);
    const ms = parseBoundedNumber(p.get("ms"), 0, 100_000);
    const rk = p.get("rk");
    /* eslint-disable react-hooks/set-state-in-effect */
    if (pf !== null) setProfile(pf);
    if (es !== null) setEssential(es);
    if (cu !== null) setCurrent(cu);
    if (ms !== null) setMonthly(ms);
    if (rk !== null && /^[01]+$/.test(rk) && rk.length === EMERGENCY_RISKS.length) {
      setRisks(rk.split("").map((c) => c === "1"));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const riskCount = risks.filter(Boolean).length;
  const r = calcEmergency({ essential, profile, riskCount, current, monthlySave: monthly });
  const pct = r.target > 0 ? Math.min(100, Math.round((current / r.target) * 100)) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
      <div className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold text-[var(--color-text-primary)]">1. 나는 어느 쪽에 가깝나요?</legend>
          {PROFILE_KEYS.map((key) => {
            const p = EMERGENCY_PROFILES[key];
            const active = profile === key;
            return (
              <label
                key={key}
                className={`cursor-pointer rounded-lg border p-3 text-sm transition-colors ${
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]"
                }`}
              >
                <input
                  type="radio"
                  name="profile"
                  className="sr-only"
                  checked={active}
                  onChange={() => setProfile(key)}
                />
                <span className="block font-medium text-[var(--color-text-primary)]">{p.label}</span>
                <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">{p.note}</span>
              </label>
            );
          })}
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold text-[var(--color-text-primary)]">
            2. 해당되는 것을 모두 고르세요 <span className="font-normal text-[var(--color-text-secondary)]">(하나당 +1개월)</span>
          </legend>
          {EMERGENCY_RISKS.map((text, i) => (
            <label key={text} className="flex cursor-pointer items-start gap-2 text-sm text-[var(--color-text-primary)]">
              <input
                type="checkbox"
                checked={risks[i]}
                onChange={() => setRisks((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
                className="mt-1 accent-[var(--color-primary)]"
              />
              <span>{text}</span>
            </label>
          ))}
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-3">
          <NumField label="월 필수 지출" unit="만원" value={essential} onChange={setEssential} hint="주거·식비·보험·대출·교통" />
          <NumField label="지금 모아 둔 비상금" unit="만원" value={current} onChange={setCurrent} />
          <NumField label="매달 넣을 수 있는 돈" unit="만원" value={monthly} onChange={setMonthly} />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <p className="text-xs font-semibold text-[var(--color-primary)]">내 비상금 목표</p>
        <p className="text-3xl font-bold text-[var(--color-text-primary)]">{fmtMan(r.target)}</p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          필수 지출 {r.months}개월치 ({EMERGENCY_PROFILES[profile].base}개월 + 추가 {riskCount}개월)
        </p>

        <div>
          <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
            <span>현재 {fmtMan(current)}</span>
            <span>{pct}%</span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-[var(--color-border)]">
            <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <p className="text-sm text-[var(--color-text-primary)]">
          {r.gap === 0
            ? "목표를 이미 채웠습니다. 이제 부족한 칸이 아니라 보관 위치와 점검 주기를 챙길 차례입니다."
            : r.monthsToGoal === null
              ? `${fmtMan(r.gap)}이 더 필요합니다. 매달 넣는 금액을 입력하면 도달 시점을 계산해 드립니다.`
              : `${fmtMan(r.gap)}이 더 필요하고, 매달 ${fmtMan(monthly)}씩 넣으면 약 ${r.monthsToGoal}개월(${(r.monthsToGoal / 12).toFixed(1)}년) 뒤 채워집니다.`}
        </p>

        <ol className="flex flex-col gap-2 border-t border-[var(--color-border)] pt-4 text-sm">
          {r.milestones.map((m) => (
            <li key={m.label} className="flex items-center justify-between gap-3">
              <span className="text-[var(--color-text-primary)]">
                {m.done ? "✓ " : "· "}
                {m.label} <span className="text-[var(--color-text-secondary)]">({fmtMan(m.amount)})</span>
              </span>
              <span className={m.done ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}>
                {m.done ? "달성" : m.monthsAway === null ? "-" : `${m.monthsAway}개월 뒤`}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
