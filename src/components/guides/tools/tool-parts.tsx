"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

export const money = (v: number) => `${v < 0 ? "-" : ""}$${Math.abs(Math.round(v)).toLocaleString("en-US")}`;

/** 가이드 글 안에 들어가는 미니 계산기의 공통 틀(제목 + 입력 영역 + 결과 영역 + 안내 문구). */
export function ToolFrame({ title, inputs, results }: { title: string; inputs: ReactNode; results: ReactNode }) {
  const t = useTranslations("GuideTools");
  return (
    <div className="not-prose my-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-base font-semibold text-[var(--color-text-primary)]">{title}</p>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">{inputs}</div>
        <div className="flex flex-col gap-3">{results}</div>
      </div>
      <p className="mt-4 text-xs text-[var(--color-text-secondary)]">{t("note")}</p>
    </div>
  );
}

export function ResultRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[var(--color-border)] pb-2 text-sm last:border-b-0">
      <span className="text-[var(--color-text-secondary)]">{label}</span>
      <span className={`tabular-nums ${strong ? "text-lg font-bold" : "font-semibold"} text-[var(--color-text-primary)]`}>{value}</span>
    </div>
  );
}

export function Verdict({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg bg-[var(--color-primary)]/10 p-3 text-sm font-medium text-[var(--color-text-primary)]">{children}</p>
  );
}
