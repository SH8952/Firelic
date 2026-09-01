"use client";

import { useState } from "react";

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
};

/** Formats a number with thousands separators (e.g. 50000 -> "50,000"),
 * always using "," regardless of the active UI locale so large money
 * values stay easy to read at a glance no matter which language is
 * selected. Preserves decimals for percentage-style sliders (e.g. 6.5). */
function formatWithCommas(n: number): string {
  if (Number.isNaN(n)) return "";
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/** Strips everything except digits, a decimal point, and a leading minus
 * sign, so typed commas (or stray characters) don't break Number() parsing. */
function parseNumberInput(raw: string): number {
  return Number(raw.replace(/,/g, "").trim());
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
  formatValue,
}: SliderProps) {
  const displayValue = formatValue ? formatValue(value) : `${formatWithCommas(value)}${suffix}`;

  // While the text field isn't focused, it always mirrors `value` formatted
  // with commas — computed directly at render time, no effect needed. While
  // the user is actively typing, `draft` holds their in-progress (raw) text
  // so the cursor never jumps around from reformatting mid-edit; it's
  // discarded on blur once `value` (and therefore the formatted text) is
  // back in sync.
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? formatWithCommas(value);

  function handleTextChange(raw: string) {
    // Allow only digits, commas, a leading minus, and a decimal point —
    // keeps stray characters from a keyboard/paste out of the field.
    const sanitized = raw.replace(/[^0-9.,-]/g, "");
    setDraft(sanitized);

    const next = parseNumberInput(sanitized);
    if (!Number.isNaN(next)) {
      onChange(Math.min(max, Math.max(min, next)));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-[var(--color-text-secondary)]">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={text}
            onFocus={() => setDraft(formatWithCommas(value))}
            onBlur={() => setDraft(null)}
            onChange={(e) => handleTextChange(e.target.value)}
            className="tabular-nums w-36 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-right text-sm text-[var(--color-text-primary)]"
            aria-label={`${label} 직접 입력`}
          />
          {suffix ? (
            <span aria-hidden="true" className="text-sm text-[var(--color-text-primary)]">
              {suffix}
            </span>
          ) : null}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-border)] accent-[var(--color-primary)]"
      />
      <span className="sr-only">{displayValue}</span>
    </div>
  );
}
