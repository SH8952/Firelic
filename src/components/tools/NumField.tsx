"use client";

import { useId, useState } from "react";

type NumFieldProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  hint?: string;
};

/** 천 단위 쉼표를 보여 주는 숫자 입력칸. 입력 중에는 원문을 유지해 커서가 튀지 않는다. */
export function NumField({ label, value, onChange, unit, min = 0, max, hint }: NumFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (Number.isFinite(value) ? value.toLocaleString("en-US", { maximumFractionDigits: 4 }) : "");

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-primary)]">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={shown}
          onFocus={() => setDraft(Number.isFinite(value) ? String(value) : "")}
          onChange={(e) => {
            const raw = e.target.value.replace(/,/g, "");
            setDraft(e.target.value);
            if (raw === "" || raw === "-" || raw === ".") {
              onChange(0);
              return;
            }
            const n = Number(raw);
            if (!Number.isNaN(n)) {
              let v = n;
              if (v < min) v = min;
              if (max !== undefined && v > max) v = max;
              onChange(v);
            }
          }}
          onBlur={() => setDraft(null)}
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
        />
        {unit ? <span className="shrink-0 text-sm text-[var(--color-text-secondary)]">{unit}</span> : null}
      </div>
      {hint ? <p className="text-xs text-[var(--color-text-secondary)]">{hint}</p> : null}
    </div>
  );
}
