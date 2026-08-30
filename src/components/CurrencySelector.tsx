"use client";

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "KRW", symbol: "₩" },
  { code: "JPY", symbol: "¥" },
];

type CurrencySelectorProps = {
  value: string;
  onChange: (code: string) => void;
  label: string;
};

export function CurrencySelector({ value, onChange, label }: CurrencySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
      <div className="flex gap-1" role="group" aria-label={label}>
        {CURRENCIES.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => onChange(c.code)}
            aria-pressed={value === c.code}
            className={`rounded-md border px-2.5 py-1 text-sm ${
              value === c.code
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]"
            }`}
          >
            {c.symbol}
          </button>
        ))}
      </div>
    </div>
  );
}

export function currencySymbolFor(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? "$";
}
