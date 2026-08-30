"use client";

type ScenarioTabsProps = {
  active: "A" | "B";
  onChange: (scenario: "A" | "B") => void;
  compareMode: boolean;
  onToggleCompare: () => void;
  labels: {
    scenarioA: string;
    scenarioB: string;
    compare: string;
  };
};

export function ScenarioTabs({ active, onChange, compareMode, onToggleCompare, labels }: ScenarioTabsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
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
