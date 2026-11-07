"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

/**
 * 라이트/다크 전환 버튼. 2026-11-07: 이모지(☀️/🌙)를 선 아이콘으로 바꾸고,
 * 접근성 문구를 4개 언어 번역(nav.toLightMode / nav.toDarkMode)으로 교체.
 * 기본값은 기존과 같이 기기 설정을 따르고(ThemeProvider), 눌러서 바꾸면 선택이 저장된다.
 */
export function ThemeToggle() {
  const t = useTranslations("nav");
  const { resolvedTheme, setTheme } = useTheme();
  // 서버 렌더에서는 false, 클라이언트 hydration 이후에는 true (hydration 경고 방지)
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";
  const label = isDark ? t("toLightMode") : t("toDarkMode");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? label : undefined}
      title={mounted ? label : undefined}
      className="flex size-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
    >
      {mounted ? (
        isDark ? <Sun className="size-5" /> : <Moon className="size-5" />
      ) : (
        <span className="size-5" />
      )}
    </button>
  );
}
