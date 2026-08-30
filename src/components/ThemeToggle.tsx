"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-8" />;

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      className="rounded-md border border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-text-primary)]"
    >
      {resolvedTheme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
