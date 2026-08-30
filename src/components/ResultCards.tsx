"use client";

type ResultCardsProps = {
  fireNumber: number;
  fireAge: number | null;
  yearsToFire: number | null;
  currencySymbol: string;
  isCoastFire: boolean;
  isLeanFire: boolean;
  labels: {
    fireNumber: string;
    fireAge: string;
    yearsToFire: string;
    notReached: string;
    coastFire: string;
    leanFire: string;
    ageUnit: string;
    yearsUnit: string;
  };
};

function formatCurrency(value: number, symbol: string) {
  return `${symbol}${Math.round(value).toLocaleString()}`;
}

export function ResultCards({
  fireNumber,
  fireAge,
  yearsToFire,
  currencySymbol,
  isCoastFire,
  isLeanFire,
  labels,
}: ResultCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr_1fr]">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <p className="text-sm text-[var(--color-text-secondary)]">{labels.fireNumber}</p>
        <p className="tabular-nums mt-1 text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
          {formatCurrency(fireNumber, currencySymbol)}
        </p>
      </div>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <p className="text-sm text-[var(--color-text-secondary)]">{labels.fireAge}</p>
        <p className="tabular-nums mt-1 text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
          {fireAge !== null ? `${fireAge}${labels.ageUnit}` : labels.notReached}
        </p>
      </div>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <p className="text-sm text-[var(--color-text-secondary)]">{labels.yearsToFire}</p>
        <p className="tabular-nums mt-1 text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
          {yearsToFire !== null ? `${yearsToFire}${labels.yearsUnit}` : labels.notReached}
        </p>
      </div>
      <div className="flex gap-2 sm:col-span-3">
        <span
          className={`rounded-full px-3 py-1 text-sm ${
            isCoastFire
              ? "bg-[var(--color-accent)] text-[#12271C]"
              : "bg-[var(--color-border)] text-[var(--color-text-secondary)]"
          }`}
        >
          {labels.coastFire}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm ${
            isLeanFire
              ? "bg-[var(--color-accent)] text-[#12271C]"
              : "bg-[var(--color-border)] text-[var(--color-text-secondary)]"
          }`}
        >
          {labels.leanFire}
        </span>
      </div>
    </div>
  );
}
