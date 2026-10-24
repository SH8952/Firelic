"use client";

type ScenarioTabsProps = {
  active: "A" | "B";
  onChange: (scenario: "A" | "B") => void;
  compareMode: boolean;
  onToggleCompare: () => void;
  /** 시나리오 탭 오른쪽에 표시할 Coast/Lean FIRE 배지(비교 모드에서는 표시하지 않음) */
  badges?: { coastFire: string; leanFire: string; isCoastFire: boolean; isLeanFire: boolean };
  labels: {
    scenarioA: string;
    scenarioB: string;
    compare: string;
  };
};

export function ScenarioTabs({ active, onChange, compareMode, onToggleCompare, badges, labels }: ScenarioTabsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
      <div role="tablist" aria-label="scenario" className="flex gap-1 rounded-lg border border-[var(--color-border)] p-1">
        {(["A", "B"] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            onClick={() => onChange(key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active === key
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            {key === "A" ? labels.scenarioA : labels.scenarioB}
          </button>
        ))}
      </div>
      {badges && (
        <div className="flex gap-2">
          {([[badges.coastFire, badges.isCoastFire], [badges.leanFire, badges.isLeanFire]] as const).map(([text, on]) => (
            <span
              key={text}
              className={`rounded-full px-3 py-1 text-sm ${
                on
                  ? "bg-[var(--color-accent)] text-[#12271C]"
                  : "bg-[var(--color-border)] text-[var(--color-text-secondary)]"
              }`}
            >
              {text}
            </span>
          ))}
        </div>
      )}
      </div>
      <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
        <input
          type="checkbox"
          checked={compareMode}
          onChange={onToggleCompare}
          className="h-4 w-4 accent-[var(--color-primary)]"
        />
        {labels.compare}
      </label>
    </div>
  );
}
